import mongoose from "mongoose";
import Sale from "../sales/sales.models";
import Inventory from "../inventory/inventory.models";
import Employee from "../employees/employees.models";

const LOW_STOCK_THRESHOLD = 5;

function getStartDate(period: string = "30d"): Date {
  const map: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = map[period] ?? 30;
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

export const getDashboardStats = async (storeId: string) => {
  const sid = toObjectId(storeId);

  const [salesAgg, inventoryCount, lowStockCount, employeeCount] =
    await Promise.all([
      Sale.aggregate([
        { $match: { storeId: sid } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalSales: { $count: {} },
          },
        },
      ]),
      Inventory.countDocuments({ storeId, active: true }),
      Inventory.countDocuments({
        storeId,
        active: true,
        quantity: { $lt: LOW_STOCK_THRESHOLD },
      }),
      Employee.countDocuments({ storeId, active: true }),
    ]);

  const { totalRevenue = 0, totalSales = 0 } = salesAgg[0] ?? {};

  return { totalRevenue, totalSales, inventoryCount, lowStockCount, employeeCount };
};

export const getKpis = async (storeId: string, period: string) => {
  const sid = toObjectId(storeId);
  const startDate = getStartDate(period);
  const prevStart = new Date(startDate);
  prevStart.setDate(prevStart.getDate() - (period === "7d" ? 7 : period === "90d" ? 90 : period === "1y" ? 365 : 30));

  const [current, previous] = await Promise.all([
    Sale.aggregate([
      { $match: { storeId: sid, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalAmount" },
          count: { $count: {} },
          avgOrder: { $avg: "$totalAmount" },
        },
      },
    ]),
    Sale.aggregate([
      { $match: { storeId: sid, createdAt: { $gte: prevStart, $lt: startDate } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]),
  ]);

  const { revenue = 0, count = 0, avgOrder = 0 } = current[0] ?? {};
  const prevRevenue: number = previous[0]?.revenue ?? 0;
  const revenueGrowth =
    prevRevenue === 0 ? null : ((revenue - prevRevenue) / prevRevenue) * 100;

  return { revenue, salesCount: count, averageOrderValue: avgOrder, revenueGrowth };
};

export const getRevenueChart = async (storeId: string, period: string) => {
  const sid = toObjectId(storeId);
  const startDate = getStartDate(period);

  return Sale.aggregate([
    { $match: { storeId: sid, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        count: { $count: {} },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", revenue: 1, count: 1 } },
  ]);
};

export const getCategoryDistribution = async (storeId: string) => {
  return Inventory.aggregate([
    { $match: { storeId: toObjectId(storeId), active: true } },
    {
      $group: {
        _id: "$category",
        count: { $count: {} },
        totalValue: { $sum: { $multiply: ["$price", "$quantity"] } },
        totalQuantity: { $sum: "$quantity" },
      },
    },
    { $sort: { totalValue: -1 } },
    { $project: { _id: 0, category: "$_id", count: 1, totalValue: 1, totalQuantity: 1 } },
  ]);
};

export const getTopSellers = async (storeId: string, period: string) => {
  const sid = toObjectId(storeId);
  const startDate = getStartDate(period);

  return Sale.aggregate([
    {
      $match: {
        storeId: sid,
        soldBy: { $exists: true },
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$soldBy",
        totalSales: { $count: {} },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "employees",
        localField: "_id",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
    {
      $project: {
        _id: 0,
        totalSales: 1,
        totalRevenue: 1,
        employee: {
          firstName: "$employee.firstName",
          lastName: "$employee.lastName",
          role: "$employee.role",
        },
      },
    },
  ]);
};

export const getTopProducts = async (storeId: string, period: string) => {
  const sid = toObjectId(storeId);
  const startDate = getStartDate(period);

  return Sale.aggregate([
    { $match: { storeId: sid, createdAt: { $gte: startDate } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.itemId",
        name: { $first: "$items.name" },
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: "$items.total" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        itemId: "$_id",
        name: 1,
        totalQuantity: 1,
        totalRevenue: 1,
      },
    },
  ]);
};

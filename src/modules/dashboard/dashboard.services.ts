import mongoose from "mongoose";
import Sale from "../sales/sales.models";
import Inventory from "../inventory/inventory.models";

const LOW_STOCK_THRESHOLD = 5;

function toObjectId(id: string) {
  return new mongoose.Types.ObjectId(id);
}

export const getDashboardStats = async (storeId: string) => {
  const sid = toObjectId(storeId);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [dailyAgg, monthlyAgg, stockAlerts] = await Promise.all([
    Sale.aggregate([
      { $match: { storeId: sid, createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Sale.aggregate([
      { $match: { storeId: sid, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $count: {} } } },
    ]),
    Inventory.countDocuments({ storeId, active: true, quantity: { $lt: LOW_STOCK_THRESHOLD } }),
  ]);

  return {
    dailySales: dailyAgg[0]?.total ?? 0,
    monthlySales: monthlyAgg[0]?.total ?? 0,
    transactions: monthlyAgg[0]?.count ?? 0,
    stockAlerts,
  };
};

export const getSalesChart = async (storeId: string, period: string = "week") => {
  const sid = toObjectId(storeId);

  const now = new Date();
  let startDate: Date;
  let labels: string[];
  let keys: string[];
  let format: string;

  if (period === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
    format = "%Y-%m";
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    labels = monthNames;
    keys = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return `${now.getFullYear()}-${month}`;
    });
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    format = "%Y-%m-%d";
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    keys = Array.from({ length: daysInMonth }, (_, i) => {
      const day = String(i + 1).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      return `${now.getFullYear()}-${month}-${day}`;
    });
  } else {
    // week: last 7 days
    startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    format = "%Y-%m-%d";
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    labels = [];
    keys = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      labels.push(dayNames[d.getDay()]);
      keys.push(d.toISOString().slice(0, 10));
    }
  }

  const data = await Sale.aggregate([
    { $match: { storeId: sid, createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format, date: "$createdAt" } },
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  const dataMap = new Map(data.map((d: { _id: string; total: number }) => [d._id, d.total]));
  const values = keys.map((key) => (dataMap.get(key) as number) ?? 0);

  return { labels, values };
};

export const getTopProducts = async (storeId: string) => {
  const sid = toObjectId(storeId);

  const products = await Sale.aggregate([
    { $match: { storeId: sid } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.itemId",
        name: { $first: "$items.name" },
        sold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, name: 1, sold: 1 } },
  ]);

  return { products };
};

export const getEmployeePerformance = async (storeId: string) => {
  const sid = toObjectId(storeId);

  const employees = await Sale.aggregate([
    { $match: { storeId: sid, soldBy: { $exists: true } } },
    {
      $group: {
        _id: "$soldBy",
        sales: { $sum: "$totalAmount" },
        transactions: { $count: {} },
      },
    },
    { $sort: { sales: -1 } },
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
        name: { $concat: ["$employee.firstName", " ", "$employee.lastName"] },
        role: "$employee.role",
        sales: 1,
        transactions: 1,
        avatar: { $substr: ["$employee.firstName", 0, 1] },
      },
    },
  ]);

  return { employees };
};

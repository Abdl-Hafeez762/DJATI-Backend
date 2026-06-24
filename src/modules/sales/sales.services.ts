import mongoose from "mongoose";
import Sale from "./sales.models";
import Inventory from "../inventory/inventory.models";

export const getAllSales = (storeId: string) => {
  return Sale.find({ storeId }).sort({ createdAt: -1 });
};

export const getSalesSummary = async (storeId: string) => {
  const result = await Sale.aggregate([
    { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalSales: { $count: {} },
        averageOrder: { $avg: "$totalAmount" },
      },
    },
  ]);

  return result[0] ?? { totalRevenue: 0, totalSales: 0, averageOrder: 0 };
};

export const createSale = async (data: any, storeId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of data.items) {
      const inventoryItem = await Inventory.findOneAndUpdate(
        { _id: item.itemId, storeId, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true, session }
      );

      if (!inventoryItem) {
        throw new Error(`Stock insuffisant pour l'article ${item.itemId}`);
      }

      item.name = inventoryItem.name;
      item.unitPrice = inventoryItem.price;
      item.total = inventoryItem.price * item.quantity;
    }

    const totalAmount = data.items.reduce(
      (sum: number, i: any) => sum + i.total,
      0
    );

    const [sale] = await Sale.create([{ ...data, storeId, totalAmount }], {
      session,
    });

    await session.commitTransaction();
    return sale;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const updateSale = (id: string, storeId: string, data: any) => {
  return Sale.findOneAndUpdate({ _id: id, storeId }, data, { new: true });
};

export const deleteSale = (id: string, storeId: string) => {
  return Sale.findOneAndDelete({ _id: id, storeId });
};

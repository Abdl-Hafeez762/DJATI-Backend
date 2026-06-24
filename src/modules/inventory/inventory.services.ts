import Inventory from "./inventory.models";

export const getAllItems = (storeId: string) => {
  return Inventory.find({ storeId, active: true });
};

export const getCategories = (storeId: string) => {
  return Inventory.distinct("category", { storeId, active: true });
};

export const getItemById = (id: string, storeId: string) => {
  return Inventory.findOne({ _id: id, storeId });
};

export const createItem = (data: any, storeId: string) => {
  return Inventory.create({ ...data, storeId });
};

export const updateItem = (id: string, storeId: string, data: any) => {
  return Inventory.findOneAndUpdate({ _id: id, storeId }, data, { new: true });
};

export const deleteItem = (id: string, storeId: string) => {
  return Inventory.findOneAndDelete({ _id: id, storeId });
};

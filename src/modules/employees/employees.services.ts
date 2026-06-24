
import bcrypt from "bcryptjs";
import Employee from "./employees.models";

export const getAllEmployees = (storeId: string) => {
  return Employee.find({ storeId });
};

export const getEmployeeById = (id: string, storeId: string) => {
  return Employee.findOne({ _id: id, storeId });
};

export const createEmployee = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);
  return Employee.create({ ...data, password: hashed });
};

export const updateEmployee = (id: string, storeId: string, data: any) => {
  return Employee.findOneAndUpdate({ _id: id, storeId }, data, { new: true });
};

export const deleteEmployee = (id: string, storeId: string) => {
  return Employee.findOneAndDelete({ _id: id, storeId });
};
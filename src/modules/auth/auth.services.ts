import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Store from "../store/store.models";
import Employee from "../employees/employees.models";

const generateStoreToken = (storeId: string): string => {
  return jwt.sign({ storeId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

const generateEmployeeToken = (
  storeId: string,
  employeeId: string,
  role: string
): string => {
  return jwt.sign({ storeId, employeeId, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const existing = await Store.findOne({ email });
  if (existing) throw new Error("Un compte avec cet email existe déjà");

  const hashed = await bcrypt.hash(password, 10);
  const store = await Store.create({ name, email, password: hashed });

  const token = generateStoreToken(store._id.toString());

  const { password: _, ...storeData } = store.toObject();
  return { store: storeData, token };
};

export const login = async (email: string, password: string) => {
  const store = await Store.findOne({ email }).select("+password");
  if (!store) throw new Error("Email ou mot de passe incorrect");

  const isMatch = await bcrypt.compare(password, store.password);
  if (!isMatch) throw new Error("Email ou mot de passe incorrect");

  const token = generateStoreToken(store._id.toString());

  const { password: _, ...storeData } = store.toObject();
  return { store: storeData, token };
};

export const loginEmployee = async (email: string, password: string) => {
  const employee = await Employee.findOne({ email, active: true }).select(
    "+password"
  );
  if (!employee) throw new Error("Email ou mot de passe incorrect");

  const isMatch = await bcrypt.compare(password, employee.password as string);
  if (!isMatch) throw new Error("Email ou mot de passe incorrect");

  const token = generateEmployeeToken(
    employee.storeId.toString(),
    employee._id.toString(),
    employee.role
  );

  const { password: _, ...employeeData } = employee.toObject();
  return { employee: employeeData, token, mustChangePassword: employee.mustChangePassword };
};

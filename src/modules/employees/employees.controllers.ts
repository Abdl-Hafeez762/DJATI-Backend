
import { Request, Response } from "express";
import * as employeeService from "./employees.services";

export const getEmployees = async (req: Request, res: Response) => {
  const employees = await employeeService.getAllEmployees(req.storeId as string);
  res.json(employees);
};

export const getEmployee = async (req: Request, res: Response) => {
  const employee = await employeeService.getEmployeeById(
    req.params.id as string,
    req.storeId as string
  );
  if (!employee) {
    res.status(404).json({ message: "Employé introuvable" });
    return;
  }
  res.json(employee);
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await employeeService.createEmployee({
      ...req.body,
      storeId: req.storeId,
    });
    res.status(201).json(employee);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const employee = await employeeService.updateEmployee(
    req.params.id as string,
    req.storeId as string,
    req.body
  );
  if (!employee) {
    res.status(404).json({ message: "Employé introuvable" });
    return;
  }
  res.json(employee);
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const employee = await employeeService.deleteEmployee(
    req.params.id as string,
    req.storeId as string
  );
  if (!employee) {
    res.status(404).json({ message: "Employé introuvable" });
    return;
  }
  res.json({ message: "Employé supprimé" });
};
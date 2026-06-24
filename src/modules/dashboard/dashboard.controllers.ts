import { Request, Response } from "express";
import * as dashboardService from "./dashboard.services";

export const getDashboardStats = async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats(req.storeId as string);
  res.json(stats);
};

export const getSalesChart = async (req: Request, res: Response) => {
  const data = await dashboardService.getSalesChart(
    req.storeId as string,
    req.query.period as string
  );
  res.json(data);
};

export const getTopProducts = async (req: Request, res: Response) => {
  const data = await dashboardService.getTopProducts(req.storeId as string);
  res.json(data);
};

export const getEmployeePerformance = async (req: Request, res: Response) => {
  const data = await dashboardService.getEmployeePerformance(req.storeId as string);
  res.json(data);
};

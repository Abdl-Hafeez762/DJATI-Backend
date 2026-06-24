import { Request, Response } from "express";
import * as analyticsService from "./analytics.services";

export const getDashboardStats = async (req: Request, res: Response) => {
  const stats = await analyticsService.getDashboardStats(req.storeId as string);
  res.json(stats);
};

export const getKpis = async (req: Request, res: Response) => {
  const kpis = await analyticsService.getKpis(
    req.storeId as string,
    req.query.period as string
  );
  res.json(kpis);
};

export const getRevenueChart = async (req: Request, res: Response) => {
  const data = await analyticsService.getRevenueChart(
    req.storeId as string,
    req.query.period as string
  );
  res.json(data);
};

export const getCategoryDistribution = async (req: Request, res: Response) => {
  const data = await analyticsService.getCategoryDistribution(req.storeId as string);
  res.json(data);
};

export const getTopSellers = async (req: Request, res: Response) => {
  const data = await analyticsService.getTopSellers(
    req.storeId as string,
    req.query.period as string
  );
  res.json(data);
};

export const getTopProducts = async (req: Request, res: Response) => {
  const data = await analyticsService.getTopProducts(
    req.storeId as string,
    req.query.period as string
  );
  res.json(data);
};

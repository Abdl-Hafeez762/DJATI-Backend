import { Request, Response } from "express";
import * as salesService from "./sales.services";

export const getSales = async (req: Request, res: Response) => {
  const sales = await salesService.getAllSales(req.storeId as string);
  res.json(sales);
};

export const getSalesSummary = async (req: Request, res: Response) => {
  const summary = await salesService.getSalesSummary(req.storeId as string);
  res.json(summary);
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const sale = await salesService.createSale(
      { ...req.body, soldBy: req.employeeId },
      req.storeId as string
    );
    res.status(201).json(sale);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  const sale = await salesService.updateSale(
    req.params.id as string,
    req.storeId as string,
    req.body
  );
  if (!sale) {
    res.status(404).json({ message: "Vente introuvable" });
    return;
  }
  res.json(sale);
};

export const deleteSale = async (req: Request, res: Response) => {
  const sale = await salesService.deleteSale(
    req.params.id as string,
    req.storeId as string
  );
  if (!sale) {
    res.status(404).json({ message: "Vente introuvable" });
    return;
  }
  res.json({ message: "Vente supprimée" });
};

import { Request, Response } from "express";
import * as inventoryService from "./inventory.services";

export const getInventory = async (req: Request, res: Response) => {
  const items = await inventoryService.getAllItems(req.storeId as string);
  res.json(items);
};

export const getCategories = async (req: Request, res: Response) => {
  const categories = await inventoryService.getCategories(req.storeId as string);
  res.json(categories);
};

export const getInventoryItem = async (req: Request, res: Response) => {
  const item = await inventoryService.getItemById(
    req.params.id as string,
    req.storeId as string
  );
  if (!item) {
    res.status(404).json({ message: "Article introuvable" });
    return;
  }
  res.json(item);
};

export const createInventoryItem = async (req: Request, res: Response) => {
  const item = await inventoryService.createItem(req.body, req.storeId as string);
  res.status(201).json(item);
};

export const updateInventoryItem = async (req: Request, res: Response) => {
  const item = await inventoryService.updateItem(
    req.params.id as string,
    req.storeId as string,
    req.body
  );
  if (!item) {
    res.status(404).json({ message: "Article introuvable" });
    return;
  }
  res.json(item);
};

export const deleteInventoryItem = async (req: Request, res: Response) => {
  const item = await inventoryService.deleteItem(
    req.params.id as string,
    req.storeId as string
  );
  if (!item) {
    res.status(404).json({ message: "Article introuvable" });
    return;
  }
  res.json({ message: "Article supprimé" });
};

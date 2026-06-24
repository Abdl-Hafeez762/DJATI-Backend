import { Request, Response } from "express";
import * as storeService from "./store.services";

export const getSettings = async (req: Request, res: Response) => {
  const store = await storeService.getStoreSettings(req.storeId!);

  if (!store) {
    res.status(404).json({ message: "Boutique introuvable" });
    return;
  }

  res.json(store);
};

export const updateSettings = async (req: Request, res: Response) => {
  const { name, email, phone, address, currency, logo } = req.body;

  const store = await storeService.updateStoreSettings(req.storeId!, {
    name,
    email,
    phone,
    address,
    currency,
    logo,
  });

  if (!store) {
    res.status(404).json({ message: "Boutique introuvable" });
    return;
  }

  res.json(store);
};

export const updatePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  try {
    await storeService.updateStorePassword(
      req.storeId!,
      currentPassword,
      newPassword
    );
    res.json({ message: "Mot de passe mis à jour" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  const { password } = req.body;

  try {
    await storeService.deleteStore(req.storeId!, password);
    res.json({ message: "Boutique supprimée" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

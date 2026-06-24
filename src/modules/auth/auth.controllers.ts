import { Request, Response } from "express";
import * as authService from "./auth.services";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};

export const loginEmployee = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginEmployee(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.json({ message: "Déconnecté avec succès" });
};

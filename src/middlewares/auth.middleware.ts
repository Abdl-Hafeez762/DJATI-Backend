import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type StorePayload = { storeId: string };
type EmployeePayload = { storeId: string; employeeId: string; role: string };

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token manquant" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as
      | StorePayload
      | EmployeePayload;

    req.storeId = decoded.storeId;

    if ("employeeId" in decoded) {
      req.employeeId = decoded.employeeId;
      req.employeeRole = decoded.role;
    }

    next();
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

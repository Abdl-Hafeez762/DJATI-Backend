import { Request, Response } from "express";
import * as auditLogsService from "./audit-logs.services";

export const getLogs = async (req: Request, res: Response) => {
  const logs = await auditLogsService.getLogs(req.storeId as string);
  res.json(logs);
};

export const createLog = async (req: Request, res: Response) => {
  const performedBy = req.employeeId
    ? { id: req.employeeId, role: req.employeeRole as string }
    : { id: req.storeId as string, role: "owner" };

  const log = await auditLogsService.createLog(
    {
      ...req.body,
      performedBy,
      ip: req.ip,
    },
    req.storeId as string
  );

  res.status(201).json(log);
};

export const exportLogs = async (req: Request, res: Response) => {
  const csv = await auditLogsService.exportLogs(req.storeId as string);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="audit-logs-${req.storeId}.csv"`
  );
  res.send(csv);
};

import AuditLog from "./audit-logs.models";

export interface CreateLogData {
  action: string;
  entity: "Sale" | "Inventory" | "Employee" | "Store" | "Auth";
  entityId?: string;
  performedBy: { id: string; role: string };
  details?: object;
  ip?: string;
}

export const getLogs = (storeId: string) => {
  return AuditLog.find({ storeId }).sort({ createdAt: -1 });
};

export const createLog = (data: CreateLogData, storeId: string) => {
  return AuditLog.create({ ...data, storeId });
};

export const exportLogs = async (storeId: string): Promise<string> => {
  const logs = await AuditLog.find({ storeId }).sort({ createdAt: -1 }).lean();

  const header = "date,action,entity,entityId,performedBy,role,ip\n";

  const rows = logs
    .map((log) => {
      const date = new Date(log.createdAt as Date).toISOString();
      const entityId = log.entityId?.toString() ?? "";
      const ip = log.ip ?? "";
      const by = log.performedBy ?? { id: "", role: "" };
      return `${date},${log.action},${log.entity},${entityId},${by.id},${by.role},${ip}`;
    })
    .join("\n");

  return header + rows;
};

declare global {
  namespace Express {
    interface Request {
      storeId?: string;
      employeeId?: string;
      employeeRole?: string;
    }
  }
}

export {};

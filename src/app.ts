import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employees/employees.routes";
import storeRoutes from "./modules/store/store.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import salesRoutes from "./modules/sales/sales.routes";
import auditLogsRoutes from "./modules/audit-logs/audit-logs.routes";
import notificationsRoutes from "./modules/notifications/notifications.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API DJATI 🚀" });
});

app.use("/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;

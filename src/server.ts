import "dotenv/config";
import express from "express";
import app from "./app";
import connectDB from "./config/db";

//swagger import
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

// Swagger UI setup
app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);



//server setup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  });
};

startServer();

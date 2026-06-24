import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DJATI API",
      version: "1.0.0",
      description: "Documentation officielle de l'API DJATI — gestion de boutique",
    },
    servers: [{ url: "http://localhost:5000", description: "Serveur local" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtenu via POST /auth/login ou POST /auth/employee/login",
        },
      },
      schemas: {
        Store: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            name: { type: "string", example: "Boutique Alger Centre" },
            email: { type: "string", example: "contact@boutique.dz" },
            phone: { type: "string", example: "0555123456" },
            address: { type: "string", example: "12 Rue Didouche Mourad" },
            currency: { type: "string", example: "DZD" },
            logo: { type: "string", example: "https://cdn.example.com/logo.png" },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Employee: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0e" },
            storeId: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            firstName: { type: "string", example: "Youcef" },
            lastName: { type: "string", example: "Benali" },
            email: { type: "string", example: "youcef@boutique.dz" },
            phone: { type: "string", example: "0661234567" },
            role: {
              type: "string",
              enum: ["owner", "manager", "cashier", "employee"],
              example: "cashier",
            },
            mustChangePassword: { type: "boolean", example: true },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        InventoryItem: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0f" },
            storeId: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            name: { type: "string", example: "Coca-Cola 33cl" },
            category: { type: "string", example: "Boissons" },
            price: { type: "number", example: 80 },
            cost: { type: "number", example: 55 },
            quantity: { type: "number", example: 120 },
            unit: { type: "string", example: "bouteille" },
            description: { type: "string", example: "Boisson gazeuse" },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        SaleItem: {
          type: "object",
          properties: {
            itemId: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0f" },
            name: { type: "string", example: "Coca-Cola 33cl" },
            quantity: { type: "number", example: 3 },
            unitPrice: { type: "number", example: 80 },
            total: { type: "number", example: 240 },
          },
        },
        Sale: {
          type: "object",
          properties: {
            _id: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c10" },
            storeId: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0d" },
            items: { type: "array", items: { $ref: "#/components/schemas/SaleItem" } },
            totalAmount: { type: "number", example: 480 },
            paymentMethod: {
              type: "string",
              enum: ["cash", "card", "transfer", "other"],
              example: "cash",
            },
            soldBy: { type: "string", example: "664f1a2b3c4d5e6f7a8b9c0e" },
            note: { type: "string", example: "Client fidèle" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AuditLog: {
          type: "object",
          properties: {
            _id: { type: "string" },
            storeId: { type: "string" },
            action: { type: "string", example: "DELETE_SALE" },
            entity: {
              type: "string",
              enum: ["Sale", "Inventory", "Employee", "Store", "Auth"],
            },
            entityId: { type: "string" },
            performedBy: {
              type: "object",
              properties: {
                id: { type: "string" },
                role: { type: "string", example: "owner" },
              },
            },
            details: { type: "object" },
            ip: { type: "string", example: "127.0.0.1" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Notification: {
          type: "object",
          properties: {
            _id: { type: "string" },
            storeId: { type: "string" },
            title: { type: "string", example: "Stock bas" },
            message: { type: "string", example: "Coca-Cola : 3 unités restantes" },
            type: {
              type: "string",
              enum: ["low_stock", "new_sale", "employee_login", "system"],
            },
            read: { type: "boolean", example: false },
            entityId: { type: "string" },
            entity: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Ressource introuvable" },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

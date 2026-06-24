import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      enum: ["Sale", "Inventory", "Employee", "Store", "Auth"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    performedBy: {
      id: { type: String, required: true },
      role: { type: String, required: true },
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ip: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);

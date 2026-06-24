import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["low_stock", "new_sale", "employee_login", "system"],
      default: "system",
    },
    read: {
      type: Boolean,
      default: false,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    entity: {
      type: String,
      enum: ["Sale", "Inventory", "Employee", "Store"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);

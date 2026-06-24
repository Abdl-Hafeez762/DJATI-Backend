import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    items: {
      type: [saleItemSchema],
      required: true,
      validate: (v: any[]) => v.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer", "other"],
      default: "cash",
    },
    note: { type: String, trim: true },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);

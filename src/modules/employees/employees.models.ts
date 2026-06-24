
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
{
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },

  firstName:{
    type:String,
    required:true
  },

  lastName:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  phone:{
    type:String
  },

  role:{
    type:String,
    enum:["owner","manager","cashier","employee"],
    default:"employee"
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  mustChangePassword: {
    type: Boolean,
    default: true,
  },

  active:{
    type:Boolean,
    default:true
  }

},
{
  timestamps:true
});

export default mongoose.model(
  "Employee",
  employeeSchema
);
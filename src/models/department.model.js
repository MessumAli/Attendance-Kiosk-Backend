import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema(
  {
    departmentName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model("Department", departmentSchema);

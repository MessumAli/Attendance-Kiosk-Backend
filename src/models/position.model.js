import mongoose, { Schema } from "mongoose";

const positionSchema = new Schema(
  {
    positionName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Position = mongoose.model("Position", positionSchema);

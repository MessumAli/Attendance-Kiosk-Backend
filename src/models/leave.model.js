import mongoose, { Schema } from "mongoose";

const leaveSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveStatus: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    leaveAppliedDate: {
      type: String,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["sick", "casual"],
    },
    leaveReason: {
      type: String,
    },
    leaveStartDate: {
      type: String,
    },
    leaveEndDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Leave = mongoose.model("Leave", leaveSchema);

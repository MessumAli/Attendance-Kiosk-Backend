import mongoose, { Schema } from "mongoose";

const attendanceLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendanceLog: {
      type: String,
      required: true,
      enum: [
        "Log-In",
        "Log-Out",
        "On-Break",
        "Off-Break",
        "Officially-Log-In",
        "Officially-Log-Out",
      ],
    },
    attendanceLogDate: {
      type: String,
    },
    attendanceLogTime: {
      type: String,
    },
    attendanceLogImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const AttendanceLog = mongoose.model(
  "AttendanceLog",
  attendanceLogSchema
);

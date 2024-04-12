import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    previousAttendance: {
      type: String,
      enum: [
        "Log-In",
        "Log-Out",
        "On-Break",
        "Off-Break",
        "Officially-Log-In",
        "Officially-Log-Out",
      ],
    },
    currentAttendance: {
      type: String,
      enum: [
        "Log-In",
        "Log-Out",
        "On-Break",
        "Off-Break",
        "Officially-Log-In",
        "Officially-Log-Out",
      ],
    },
    todayAttendance: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Holiday", "Public-Holiday"],
    },
    todayArrival: {
      type: String,
      enum: ["On-Time", "Late-In"],
    },
    attendanceTime: {
      type: String,
    },
    attendanceDate: {
      type: String,
    },
    todayLoginTime: {
      type: String,
    },
    todayLogoutTime: {
      type: String,
    },
    todayOnBreakTime: {
      type: String,
    },
    todayOffBreakTime: {
      type: String,
    },
    todayTotalBreakTime: {
      type: String,
      default: "0 hrs 0 mins",
    },
    todayOfficiallyLogOutTime: {
      type: String,
    },
    todayOfficiallyLogInTime: {
      type: String,
    },
    todayTotalOfficiallyOutTime: {
      type: String,
      default: "0 hrs 0 mins",
    },
    todayTotalTime: {
      type: String,
    },
    todayTotalWorkingTime: {
      type: String,
    },
    todayTotalDeficitTime: {
      type: String,
    },
    todayTotalOverTime: {
      type: String,
    },
    attendanceImage: {
      type: String,
    },
    isManual: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);

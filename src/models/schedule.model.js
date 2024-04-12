import mongoose, { Schema } from "mongoose";

const scheduleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    scheduleStartTime: {
      type: String,
    },
    scheduleEndTime: {
      type: String,
    },
    scheduleGraceTime: {
      type: String,
    },
    scheduleStartDate: {
      type: String,
    },
    scheduleEndDate: {
      type: String,
    },
    scheduleTotalHours: {
      type: String,
    },
    scheduleWorkingDays: {
      type: [
        {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);

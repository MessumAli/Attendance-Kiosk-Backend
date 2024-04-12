import { User } from "../models/user.model.js";
import { Schedule } from "../models/schedule.model.js";
import { Attendance } from "../models/attendance.model.js";
import { AttendanceLog } from "../models/attendanceLog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose, { Schema } from "mongoose";

function formattedTime(time) {
  const regexPattern = /^\d{1,2}:\d{2}\s(?:AM|PM)$/i;

  if (regexPattern.test(time)) {
    return time;
  }
  const isoTime = new Date(time);
  const options = { hour: "numeric", minute: "numeric" };
  const localeTime = isoTime.toLocaleTimeString(undefined, options);
  return localeTime;
}

function formattedDate(date) {
  const isoDate = new Date(date);
  const year = isoDate.getFullYear();
  const month = (isoDate.getMonth() + 1).toString().padStart(2, "0");
  const day = isoDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const createAttendanceLog = asyncHandler(async (req, res) => {
  const { rfId, attendanceLog, attendanceLogImg } = req.body;

  if (
    ![
      "Log-In",
      "Log-Out",
      "On-Break",
      "Off-Break",
      "Officially-Log-In",
      "Officially-Log-Out",
    ].includes(attendanceLog)
  ) {
    throw new ApiError(400, "Invalid attendanceLog value");
  }

  const logTime = formattedTime(new Date());

  const logDate = formattedDate(new Date());

  const user = await User.findOne({ rfId });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const createLog = await AttendanceLog.create({
    user: user._id,
    attendanceLog: attendanceLog,
    attendanceLogTime: logTime,
    attendanceLogDate: logDate,
    attendanceLogImage: attendanceLogImg,
  });

  const createdAttendanceLog = await AttendanceLog.findById(createLog._id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { attendanceLog: createdAttendanceLog },
        "Attendance Log created successfully"
      )
    );
});

const getAllAttendanceLogs = asyncHandler(async (req, res) => {
  const { userId, selectedDate } = req.query;
  const query = {
    user: userId,
    attendanceLogDate: selectedDate,
  };

  const allAttendanceLogs = await AttendanceLog.find(query).populate({
    path: "user",
    select: "firstName lastName email position department",
  });

  const flattenedAllAttendanceLogs = allAttendanceLogs.map(
    (attendanceLogs) => ({
      _id: attendanceLogs._id,
      firstName: attendanceLogs.user.firstName,
      lastName: attendanceLogs.user.lastName,
      email: attendanceLogs.user.email,
      position: attendanceLogs.user.position,
      department: attendanceLogs.user.department,
      userId: attendanceLogs.user._id,
      attendanceLog: attendanceLogs.attendanceLog,
      attendanceLogTime: attendanceLogs.attendanceLogTime,
      attendanceLogDate: attendanceLogs.attendanceLogDate,
      attendanceLogImage: attendanceLogs.attendanceLogImage,
      createdAt: attendanceLogs.createdAt,
      updatedAt: attendanceLogs.updatedAt,
      __v: attendanceLogs.__v,
    })
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { attendanceLogs: flattenedAllAttendanceLogs },
        "All Attendance Logs retrieved successfully"
      )
    );
});

export { createAttendanceLog, getAllAttendanceLogs };

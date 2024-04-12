import { User } from "../models/user.model.js";
import { Schedule } from "../models/schedule.model.js";
import { Attendance } from "../models/attendance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

function convertToMinutes(timeString) {
  const regex = /(\d+)\s*hrs\s*(\d+)\s*mins/;
  const matches = timeString.match(regex);
  
  if (!matches || matches.length !== 3) {
      throw new Error('Invalid time format. Expected "X hrs Y mins".');
  }

  const hours = parseInt(matches[1], 10);
  const minutes = parseInt(matches[2], 10);

  if (isNaN(hours) || isNaN(minutes)) {
      throw new Error('Invalid time format. Hours and minutes must be numbers.');
  }

  return hours * 60 + minutes;
}

function formattedDate(date) {
  const isoDate = new Date(date);
  const year = isoDate.getFullYear();
  const month = (isoDate.getMonth() + 1).toString().padStart(2, "0");
  const day = isoDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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

function compareTimes(time1, time2) {
  const parseTime = (timeStr) => {
    const regex = /^(\d{1,2}):(\d{2})\s*([APMapm]{2})$/;
    const match = timeStr.match(regex);

    if (!match) {
      return NaN;
    }

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (hours === 12) {
      hours = period === "AM" ? 0 : 12;
    } else {
      hours = period === "PM" ? hours + 12 : hours;
    }

    return hours * 60 + minutes;
  };

  const minutes1 = parseTime(time1);
  const minutes2 = parseTime(time2);

  if (isNaN(minutes1) || isNaN(minutes2)) {
    return "Invalid time format";
  }

  if (minutes2 >= minutes1) {
    return "Late-In";
  } else {
    return "On-Time";
  }
}

const getAllAttendance = asyncHandler(async (req, res) => {
  const { startDate, endDate, userId } = req.query;

  const user = await User.findById(userId);

  let query;

  if (user.role === "Employee") {
    query = {
      user: user._id,
      attendanceDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  } else {
    query = {
      attendanceDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  const allAttendance = await Attendance.find(query)
    .populate("user", "firstName lastName email position department rfId")
    .populate({
      path: "schedule",
      select: "scheduleTotalHours",
    });

  const flattenedAllAttendance = allAttendance.map((attendance) => ({
    _id: attendance._id,
    userId: attendance.user._id,
    firstName: attendance.user.firstName,
    lastName: attendance.user.lastName,
    email: attendance.user.email,
    position: attendance.user.position,
    department: attendance.user.department,
    rfId: attendance.user.rfId,
    attendanceImage: attendance.attendanceImage,
    attendanceDate: attendance.attendanceDate,
    scheduleTotalHours: attendance.schedule.scheduleTotalHours,
    todayLoginTime: attendance.todayLoginTime,
    todayLogoutTime: attendance.todayLogoutTime,
    todayArrival: attendance.todayArrival,
    todayTotalTime: attendance.todayTotalTime,
    todayTotalWorkingTime: attendance.todayTotalWorkingTime,
    todayTotalDeficitTime: attendance.todayTotalDeficitTime,
    todayTotalOverTime: attendance.todayTotalOverTime,
    todayTotalBreakTime: convertToMinutes(attendance.todayTotalBreakTime),
    todayTotalOfficiallyOutTime: convertToMinutes(attendance.todayTotalOfficiallyOutTime),
    currentAttendance: attendance.currentAttendance,
    isManual: attendance.isManual,
    createdAt: attendance.createdAt,
    updatedAt: attendance.updatedAt,
    __v: attendance.__v,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allAttendance: flattenedAllAttendance },
        "List of all attendance retrieved successfully"
      )
    );
});

const createManualAttendance = asyncHandler(async (req, res) => {
  const { rfId, attendanceLog, attendanceDate, attendanceTime } = req.body;

  if (!["Log-In"].includes(attendanceLog)) {
    throw new ApiError(400, "Invalid attendanceLog value");
  }

  const user = await User.findOne({ rfId });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const schedule = await Schedule.findOne({ user: user._id });

  if (!schedule) {
    throw new ApiError(404, "Schedule not found");
  }

  if (attendanceLog === "Log-In") {
    const existingAttendance = await Attendance.findOne({
      user: user._id,
      attendanceDate: formattedDate(attendanceDate),
    });

    if (existingAttendance) {
      throw new ApiError(400, "Error during Log-In");
    }

    const userSchedule = await Schedule.findOne({
      user: user._id,
    });

    const { scheduleGraceTime } = userSchedule;

    const logInTime = formattedTime(attendanceTime);

    const arrivalStatus = compareTimes(scheduleGraceTime, logInTime);

    await Attendance.create({
      user: user._id,
      schedule: schedule._id,
      previousAttendance: attendanceLog,
      currentAttendance: attendanceLog,
      todayAttendance: "Present",
      todayArrival: arrivalStatus,
      todayLoginTime: logInTime,
      attendanceDate: formattedDate(attendanceDate),
      isManual: true,
    });
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Manual Attendance created successfully"));
});

export { getAllAttendance, createManualAttendance };

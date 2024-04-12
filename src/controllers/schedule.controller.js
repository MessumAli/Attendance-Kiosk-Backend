import { Schedule } from "../models/schedule.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

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

function timeDiff(time1, time2) {
  const time01 = new Date("2000-01-01 " + time1);
  const time02 = new Date("2000-01-01 " + time2);

  const timeDiff = Math.abs(time02 - time01);

  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);

  return `${hours} hrs ${minutes} mins`;
}

const createSchedule = asyncHandler(async (req, res) => {
  const {
    _id,
    scheduleStartTime,
    scheduleEndTime,
    scheduleStartDate,
    scheduleEndDate,
    scheduleGraceTime,
    scheduleWorkingDays,
  } = req.body;

  const startTime = formattedTime(scheduleStartTime);
  const endTime = formattedTime(scheduleEndTime);
  const graceTime = formattedTime(scheduleGraceTime);
  const startDate = formattedDate(scheduleStartDate);
  const endDate = formattedDate(scheduleEndDate);

  const totalHours = timeDiff(startTime, endTime);

  const schedule = await Schedule.create({
    user: _id,
    scheduleStartTime: startTime,
    scheduleEndTime: endTime,
    scheduleGraceTime: graceTime,
    scheduleStartDate: startDate,
    scheduleEndDate: endDate,
    scheduleTotalHours: totalHours,
    scheduleWorkingDays,
  });

  const createdSchedule = await Schedule.findById(schedule._id);

  if (!createdSchedule) {
    throw new ApiError(500, "Something went wrong while creating the schedule");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { schedule: createdSchedule },
        "Schedule created successfully"
      )
    );
});

const getAllSchedules = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  let schedules;

  const user = await User.findById(userId);

  if (user.role === "Employee") {
    schedules = await Schedule.find({ user: userId }).populate({
      path: "user",
      select: "firstName lastName email rfId",
    });
  } else {
    schedules = await Schedule.find().populate({
      path: "user",
      select: "firstName lastName email rfId position department",
    });
  }

  const flattenedSchedules = schedules.map((schedule) => ({
    _id: schedule._id,
    firstName: schedule.user.firstName,
    lastName: schedule.user.lastName,
    email: schedule.user.email,
    rfId: schedule.user.rfId,
    position: schedule.user.position,
    department: schedule.user.department,
    scheduleStartTime: schedule.scheduleStartTime,
    scheduleEndTime: schedule.scheduleEndTime,
    scheduleGraceTime: schedule.scheduleGraceTime,
    scheduleStartDate: schedule.scheduleStartDate,
    scheduleEndDate: schedule.scheduleEndDate,
    scheduleTotalHours: schedule.scheduleTotalHours,
    scheduleWorkingDays: schedule.scheduleWorkingDays,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    __v: schedule.__v,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { schedules: flattenedSchedules },
        "List of all schedules retrieved successfully"
      )
    );
});

const deleteSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;

  const existingSchedule = await Schedule.findById(scheduleId);

  if (!existingSchedule) {
    throw new ApiError(404, "Schedule not found");
  }

  await Schedule.findByIdAndDelete(scheduleId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Schedule deleted successfully"));
});

const updateSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const updateFields = req.body;
  const {
    scheduleStartDate,
    scheduleEndDate,
    scheduleGraceTime,
    scheduleStartTime,
    scheduleEndTime,
    scheduleWorkingDays,
  } = updateFields;

  const startTime = formattedTime(scheduleStartTime);
  const endTime = formattedTime(scheduleEndTime);
  const graceTime = formattedTime(scheduleGraceTime);
  const startDate = formattedDate(scheduleStartDate);
  const endDate = formattedDate(scheduleEndDate);

  const totalHours = timeDiff(startTime, endTime);

  const existingSchedule = await Schedule.findById(scheduleId);

  if (!existingSchedule) {
    throw new ApiError(404, "Schedule not found");
  }

  const updatedSchedule = await Schedule.findByIdAndUpdate(
    scheduleId,
    {
      scheduleStartTime: startTime,
      scheduleEndTime: endTime,
      scheduleGraceTime: graceTime,
      scheduleStartDate: startDate,
      scheduleEndDate: endDate,
      scheduleTotalHours: totalHours,
      scheduleWorkingDays,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedSchedule) {
    throw new ApiError(500, "Something went wrong while updating the schedule");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { schedule: updatedSchedule },
        "Schedule updated successfully"
      )
    );
});

export { createSchedule, getAllSchedules, deleteSchedule, updateSchedule };

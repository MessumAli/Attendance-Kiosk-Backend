import { User } from "../models/user.model.js";
import { Schedule } from "../models/schedule.model.js";
import { Attendance } from "../models/attendance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// function convertISOtoHoursMinutes(isoString) {
//   const date = new Date(isoString);
//   const hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes();
//   return `${hours} hours ${minutes} minutes`;
// }

// function calculateOvertime(workingTime, scheduleTotalHours) {
//   const formattedScheduleTotalHours =
//     convertISOtoHoursMinutes(scheduleTotalHours);

//   const workingTimeArray = workingTime.match(/\d+/g).map(Number);
//   const scheduleTotalHoursArray = formattedScheduleTotalHours
//     .match(/\d+/g)
//     .map(Number);

//   const overTimeHours = workingTimeArray[0] - scheduleTotalHoursArray[0];
//   const overTimeMinutes = workingTimeArray[1] - scheduleTotalHoursArray[1];

//   if (overTimeHours < 0 || (overTimeHours === 0 && overTimeMinutes <= 0)) {
//     return "0 hours 0 minutes";
//   }

//   return `${overTimeHours} hours ${overTimeMinutes} minutes`;
// }

// function calculateDeficitHours(time1, time2) {
//   const match = time1.match(/^(\d+) hours (\d+) minutes$/);
//   if (match) {
//     const hours = parseInt(match[1], 10);
//     const minutes = parseInt(match[2], 10);

//     const date1 = new Date(0);
//     date1.setUTCHours(hours, minutes);

//     const date2 = new Date(time2);

//     if (isNaN(date2)) {
//       return "Invalid time format for time2";
//     }

//     if (date1 >= date2) {
//       return `0 hours 0 minutes`;
//     }

//     const diffInMilliseconds = date2 - date1;

//     const calculatedHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
//     const calculatedMinutes = Math.floor(
//       (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
//     );

//     return `${calculatedHours} hours ${calculatedMinutes} minutes`;
//   }
// }

// function convertToMilliseconds(time) {
//   const regexResult = time.match(/(\d+) hours (\d+) minutes/);

//   if (!regexResult) {
//     throw new Error("Invalid time format");
//   }

//   const [, hours, minutes] = regexResult;

//   return (parseInt(hours, 10) * 60 + parseInt(minutes, 10)) * 60 * 1000;
// }

// function calculateDifference(time1, time2) {
//   const diffInMilliseconds =
//     convertToMilliseconds(time1) - convertToMilliseconds(time2);

//   const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
//   const minutes = Math.floor(
//     (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
//   );

//   return `${hours} hours ${minutes} minutes`;
// }

// function calculateTimeDifference(time1, time2) {
//   const diffInMilliseconds = new Date(time2) - new Date(time1);

//   const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
//   const minutes = Math.floor(
//     (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
//   );

//   return `${hours} hours ${minutes} minutes`;
// }

function addTimes(time1, time2) {
  const regex = /(\d+) hrs (\d+) mins/;
  const match1 = time1.match(regex);
  const match2 = time2.match(regex);

  if (!match1 || !match2) {
    throw new Error("Invalid time string format.");
  }

  const hours1 = parseInt(match1[1], 10);
  const minutes1 = parseInt(match1[2], 10);

  const hours2 = parseInt(match2[1], 10);
  const minutes2 = parseInt(match2[2], 10);

  const totalHours = hours1 + hours2;
  const totalMinutes = minutes1 + minutes2;

  const resultHours = Math.floor(totalMinutes / 60);
  const resultMinutes = totalMinutes % 60;

  const result = `${totalHours + resultHours} hrs ${resultMinutes} mins`;

  return result;
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

function timeDiff(time1, time2) {
  const time01 = new Date("2000-01-01 " + time1);
  const time02 = new Date("2000-01-01 " + time2);

  const timeDiff = Math.abs(time02 - time01);

  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);

  return `${hours} hrs ${minutes} mins`;
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

function timeDiff1(time1, time2) {
  const parseTime = (timeStr) => {
    const regex = /(\d+)\s*hrs\s*(\d+)\s*mins/;
    const match = timeStr.match(regex);

    if (!match) {
      return { hours: 0, minutes: 0 };
    }

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return { hours, minutes };
  };

  const { hours: hours1, minutes: minutes1 } = parseTime(time1);
  const { hours: hours2, minutes: minutes2 } = parseTime(time2);

  if (hours1 > 24 || hours2 > 24 || minutes1 >= 60 || minutes2 >= 60) {
    return "Invalid time format";
  }

  const totalMinutes1 = hours1 * 60 + minutes1;
  const totalMinutes2 = hours2 * 60 + minutes2;

  if (totalMinutes1 >= totalMinutes2) {
    return "0 hrs 0 mins";
  }

  const timeDiff = totalMinutes2 - totalMinutes1;

  const hoursDiff = Math.floor(timeDiff / 60);
  const remainingMinutes = timeDiff % 60;

  return `${hoursDiff} hrs ${remainingMinutes} mins`;
}

export const createAttendance = asyncHandler(async (req, res, next) => {
  try {
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

    const user = await User.findOne({ rfId });
    const schedule = await Schedule.findOne({ user: user._id });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (attendanceLog === "Log-In") {
      const existingAttendance = await Attendance.findOne({
        user: user._id,
        attendanceDate: formattedDate(new Date()),
      });

      if (existingAttendance) {
        throw new ApiError(400, "Error during Log-In");
      }

      const userSchedule = await Schedule.findOne({
        user: user._id,
      });

      const {scheduleGraceTime} = userSchedule;

      const logInTime = formattedTime(new Date())

      const arrivalStatus = compareTimes(scheduleGraceTime, logInTime)

      await Attendance.create({
        user: user._id,
        schedule: schedule._id,
        previousAttendance: attendanceLog,
        currentAttendance: attendanceLog,
        todayAttendance: "Present",
        todayArrival: arrivalStatus,
        todayLoginTime: logInTime,
        attendanceDate: formattedDate(new Date()),
        attendanceImage: attendanceLogImg,
      });

      req.body = { rfId, attendanceLog, attendanceLogImg };
    }

    if (attendanceLog === "Log-Out") {
      const noAttendance = await Attendance.findOne({
        user: user._id,
        attendanceDate: formattedDate(new Date()),
      });

      if (!noAttendance) {
        throw new ApiError(400, "Error during Log-Out");
      }

      const existingAttendance = await Attendance.findOne({
        user: user._id,
        currentAttendance: {
          $in: [
            "Log-Out",
            "On-Break",
            "Off-Break",
            "Officially-Log-In",
            "Officially-Log-Out",
            null,
          ],
        },
        attendanceDate: formattedDate(new Date()),
      });

      if (existingAttendance) {
        throw new ApiError(400, "Error during Log-Out");
      }

      const logOutUser = await Attendance.findOne({
        user: user._id,
        currentAttendance: "Log-In",
        attendanceDate: formattedDate(new Date()),
      }).populate("schedule");

      const { todayLoginTime, todayTotalBreakTime } = logOutUser;

      const { scheduleTotalHours } = logOutUser.schedule;

      const logOutTime = formattedTime(new Date());

      const totalTime = timeDiff(todayLoginTime, logOutTime);

      const workingTime = timeDiff1(todayTotalBreakTime, totalTime);

      const deficitTime = timeDiff1(workingTime, scheduleTotalHours);

      const overTime = timeDiff1(scheduleTotalHours, workingTime);

      await Attendance.findOneAndUpdate(
        {
          user: user._id,
          currentAttendance: "Log-In",
          attendanceDate: formattedDate(new Date()),
        },
        {
          $set: {
            previousAttendance: attendanceLog,
            currentAttendance: attendanceLog,
            todayLogoutTime: logOutTime,
            todayTotalTime: totalTime,
            todayTotalWorkingTime: workingTime,
            todayTotalDeficitTime: deficitTime,
            todayTotalOverTime: overTime,
            attendanceImage: attendanceLogImg,
          },
        },
        { new: true }
      );

      // const updatedLogOutUser = await Attendance.findOne({
      //   user: user._id,
      //   currentAttendance: null,
      //   createdAt: {
      //     $gte: todayStart,
      //     $lt: todayEnd,
      //   },
      // }).populate("schedule");

      // const { scheduleTotalHours } = updatedLogOutUser.schedule;

      // console.log(scheduleTotalHours);

      // const { todayTotalTime, todayTotalBreakTime } = updatedLogOutUser;

      // const workingTime = calculateDifference(
      //   todayTotalTime,
      //   todayTotalBreakTime
      // );

      // console.log(workingTime);

      // const deficitTime = calculateDeficitHours(
      //   workingTime,
      //   scheduleTotalHours
      // );

      // console.log(deficitTime);

      // const overTime = calculateOvertime(workingTime, scheduleTotalHours);

      // console.log(overTime);

      // await Attendance.findOneAndUpdate(
      //   {
      //     user: user._id,
      //     currentAttendance: null,
      //     createdAt: {
      //       $gte: todayStart,
      //       $lt: todayEnd,
      //     },
      //   },
      //   {
      //     $set: {
      //       todayTotalWorkingTime: workingTime,
      //       todayTotalDeficitTime: deficitTime,
      //       todayTotalOverTime: overTime,
      //     },
      //   },
      //   { new: true }
      // );

      req.body = { rfId, attendanceLog, attendanceLogImg };
    }

    if (attendanceLog === "On-Break") {
      const noAttendance = await Attendance.findOne({
        user: user._id,
        attendanceDate: formattedDate(new Date()),
      });

      if (!noAttendance) {
        throw new ApiError(400, "Error during On-Break");
      }

      const existingAttendance = await Attendance.findOne({
        user: user._id,
        currentAttendance: {
          $in: [
            "Log-Out",
            "On-Break",
            "Off-Break",
            "Officially-Log-In",
            "Officially-Log-Out",
            null,
          ],
        },
        attendanceDate: formattedDate(new Date()),
      });

      if (existingAttendance) {
        throw new ApiError(400, "Error during On-Break");
      }

      await Attendance.findOneAndUpdate(
        {
          user: user._id,
          currentAttendance: "Log-In",
          attendanceDate: formattedDate(new Date()),
        },
        {
          $set: {
            previousAttendance: attendanceLog,
            currentAttendance: attendanceLog,
            todayOnBreakTime: formattedTime(new Date()),
            attendanceImage: attendanceLogImg,
          },
        },
        { new: true }
      );
      req.body = { rfId, attendanceLog, attendanceLogImg };
    }

    if (attendanceLog === "Off-Break") {
      const noAttendance = await Attendance.findOne({
        user: user._id,
        attendanceDate: formattedDate(new Date()),
      });

      if (!noAttendance) {
        throw new ApiError(400, "Error during Off-Break");
      }

      const existingAttendance = await Attendance.findOne({
        user: user._id,
        currentAttendance: {
          $in: [
            "Log-In",
            "Log-Out",
            "Off-Break",
            "Officially-Log-In",
            "Officially-Log-Out",
            null,
          ],
        },
        attendanceDate: formattedDate(new Date()),
      });

      if (existingAttendance) {
        throw new ApiError(400, "Error during Off-Break");
      }

      const breakTimeUser = await Attendance.findOne({
        user: user._id,
        previousAttendance: "On-Break",
        attendanceDate: formattedDate(new Date()),
      });

      const { todayOnBreakTime, todayTotalBreakTime } = breakTimeUser;

      const offBreakTime = formattedTime(new Date());

      const breakTime = timeDiff(todayOnBreakTime, offBreakTime);

      const totalBreakTime = addTimes(todayTotalBreakTime, breakTime);

      await Attendance.findOneAndUpdate(
        {
          user: user._id,
          currentAttendance: "On-Break",
          attendanceDate: formattedDate(new Date()),
        },
        {
          $set: {
            previousAttendance: attendanceLog,
            currentAttendance: "Log-In",
            todayOffBreakTime: offBreakTime,
            todayTotalBreakTime: totalBreakTime,
            attendanceImage: attendanceLogImg,
          },
        },
        { new: true }
      );
      req.body = { rfId, attendanceLog, attendanceLogImg };
    }

    if (attendanceLog === "Officially-Log-Out") {
      const noAttendance = await Attendance.findOne({
        user: user._id,
        attendanceDate: formattedDate(new Date()),
      });

      if (!noAttendance) {
        throw new ApiError(400, "Error during Officially-Log-Out");
      }

      const existingAttendance = await Attendance.findOne({
        user: user._id,
        currentAttendance: {
          $in: [
            "Log-Out",
            "On-Break",
            "Off-Break",
            "Officially-Log-In",
            "Officially-Log-Out",
            null,
          ],
        },
        attendanceDate: formattedDate(new Date()),
      });

      if (existingAttendance) {
        throw new ApiError(400, "Error during Officially-Log-Out");
      }

      await Attendance.findOneAndUpdate(
        {
          user: user._id,
          currentAttendance: "Log-In",
          attendanceDate: formattedDate(new Date()),
        },
        {
          $set: {
            previousAttendance: attendanceLog,
            currentAttendance: attendanceLog,
            todayOfficiallyLogOutTime: formattedTime(new Date()),
            attendanceImage: attendanceLogImg,
          },
        },
        { new: true }
      );
      req.body = { rfId, attendanceLog, attendanceLogImg };
    }

    if (attendanceLog === "Officially-Log-In") {
      const noAttendance = await Attendance.findOne({
        user: user._id,
        attendanceDate: formattedDate(new Date()),
      });

      if (!noAttendance) {
        throw new ApiError(400, "Error during Officially-Log-In");
      }

      const existingAttendance = await Attendance.findOne({
        user: user._id,
        currentAttendance: {
          $in: [
            "Log-In",
            "Log-Out",
            "On-Break",
            "Off-Break",
            "Officially-Log-In",
            null,
          ],
        },
        attendanceDate: formattedDate(new Date()),
      });

      if (existingAttendance) {
        throw new ApiError(400, "Error during Officially-Log-In");
      }

      const officiallyOutUser = await Attendance.findOne({
        user: user._id,
        previousAttendance: "Officially-Log-Out",
        attendanceDate: formattedDate(new Date()),
      });

      const { todayOfficiallyLogOutTime, todayTotalOfficiallyOutTime } =
        officiallyOutUser;

      const officiallyLogInTime = formattedTime(new Date());

      const OfficiallyOutTime = timeDiff(
        todayOfficiallyLogOutTime,
        officiallyLogInTime
      );

      const totalOfficiallyOutTime = addTimes(
        todayTotalOfficiallyOutTime,
        OfficiallyOutTime
      );

      await Attendance.findOneAndUpdate(
        {
          user: user._id,
          currentAttendance: "Officially-Log-Out",
          attendanceDate: formattedDate(new Date()),
        },
        {
          $set: {
            previousAttendance: attendanceLog,
            currentAttendance: "Log-In",
            todayOfficiallyLogInTime: officiallyLogInTime,
            todayTotalOfficiallyOutTime: totalOfficiallyOutTime,
            attendanceImage: attendanceLogImg,
          },
        },
        { new: true }
      );

      req.body = { rfId, attendanceLog, attendanceLogImg };
    }

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Error in Attendance");
  }
});

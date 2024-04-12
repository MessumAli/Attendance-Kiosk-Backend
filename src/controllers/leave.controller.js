import { User } from "../models/user.model.js";
import { Leave } from "../models/leave.model.js";
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

const createLeave = asyncHandler(async (req, res) => {
  const { userId, leaveType, leaveReason, leaveStartDate, leaveEndDate } =
    req.body;

  const startDate = formattedDate(leaveStartDate);
  const endDate = formattedDate(leaveEndDate);
  const appliedDate = formattedDate(new Date());

  const leave = await Leave.create({
    user: userId,
    leaveAppliedDate: appliedDate,
    leaveType,
    leaveReason,
    leaveStartDate: startDate,
    leaveEndDate: endDate,
  });

  const createdLeave = await Leave.findById(leave._id);

  if (!createdLeave) {
    throw new ApiError(500, "Something went wrong while creating the leave");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { leave: createdLeave },
        "Leave created successfully"
      )
    );
});

const getAllLeave = asyncHandler(async (req, res) => {
  const { startDate, endDate, userId } = req.query;

  const user = await User.findById(userId);

  let query;

  if (user.role === "Employee") {
    query = {
      user: user._id,
      leaveAppliedDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  } else {
    query = {
      leaveAppliedDate: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  const allLeave = await Leave.find(query).populate(
    "user",
    "firstName lastName email position department rfId"
  );

  const flattenedAllLeave = allLeave.map((leave) => ({
    _id: leave._id,
    userId: leave.user._id,
    firstName: leave.user.firstName,
    lastName: leave.user.lastName,
    email: leave.user.email,
    position: leave.user.position,
    department: leave.user.department,
    rfId: leave.user.rfId,
    leaveStatus: leave.leaveStatus,
    leaveAppliedDate: leave.leaveAppliedDate,
    leaveType: leave.leaveType,
    leaveReason: leave.leaveReason,
    leaveStartDate: leave.leaveStartDate,
    leaveEndDate: leave.leaveEndDate,
    createdAt: leave.createdAt,
    updatedAt: leave.updatedAt,
    __v: leave.__v,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { allLeave: flattenedAllLeave },
        "List of all leave retrieved successfully"
      )
    );
});

const changeLeaveStatus = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;
  const { leaveStatus } = req.body;

  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new ApiError(404, "Leave not found");
  }

  leave.leaveStatus = leaveStatus;
  await leave.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Leave status updated successfully"));
});

export { createLeave, getAllLeave, changeLeaveStatus };

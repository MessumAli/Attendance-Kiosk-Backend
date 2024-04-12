import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import bcrypt from "bcrypt";

function formattedDate(date) {
  const isoDate = new Date(date);
  const year = isoDate.getFullYear();
  const month = (isoDate.getMonth() + 1).toString().padStart(2, "0");
  const day = isoDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ softDelete: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users },
        "List of all users retrieved successfully"
      )
    );
});

const toggleSoftDelete = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.softDelete = !user.softDelete;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  // const { _id } = req.body;
  // const updateFields = req.body;

  const { _id, password, ...updateFields } = req.body;

  const user = await User.findById(_id);

  if (password !== user.password) {
    const updatedPassword = await bcrypt.hash(password, 10);
    updateFields.password = updatedPassword;
  }

  if (updateFields.startDate !== user.startDate) {
    const formattedStartDate = formattedDate(updateFields.startDate);
    updateFields.startDate = formattedStartDate;
  }

  const updatedUser = await User.findByIdAndUpdate(_id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser },
        "User information updated successfully"
      )
    );
});

export { getAllUsers, toggleSoftDelete, updateUser };

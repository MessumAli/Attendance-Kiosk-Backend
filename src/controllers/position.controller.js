import { Position } from "../models/position.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const createPosition = asyncHandler(async (req, res) => {
  const { positionName } = req.body;

  const position = await Position.create({
    positionName,
  });

  const createdPosition = await Position.findById(position._id);

  if (!createdPosition) {
    throw new ApiError(500, "Something went wrong while creating the position");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { position: createdPosition },
        "Position created successfully"
      )
    );
});

const getAllPositions = asyncHandler(async (req, res) => {
  const positions = await Position.find();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { positions },
        "List of all positions retrieved successfully"
      )
    );
});

const deletePosition = asyncHandler(async (req, res) => {
  const { positionId } = req.params;

  const existingPosition = await Position.findById(positionId);

  if (!existingPosition) {
    throw new ApiError(404, "Position not found");
  }

  await Position.findByIdAndDelete(positionId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Position deleted successfully"));
});

const updatePosition = asyncHandler(async (req, res) => {
  const { positionId } = req.params;
  const { positionName } = req.body;

  const existingPosition = await Position.findById(positionId);

  if (!existingPosition) {
    throw new ApiError(404, "Position not found");
  }

  const updatedPosition = await Position.findByIdAndUpdate(
    positionId,
    {
      positionName,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPosition) {
    throw new ApiError(500, "Something went wrong while updating the position");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { position: updatedPosition },
        "Position updated successfully"
      )
    );
});

export { createPosition, getAllPositions, deletePosition, updatePosition };

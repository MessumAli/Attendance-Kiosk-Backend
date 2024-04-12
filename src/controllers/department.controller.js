import { Department } from "../models/department.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const createDepartment = asyncHandler(async (req, res) => {
  const { departmentName } = req.body;

  const department = await Department.create({
    departmentName,
  });

  const createdDepartment = await Department.findById(department._id);

  if (!createdDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while creating the department"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { department: createdDepartment },
        "Department created successfully"
      )
    );
});

const getAllDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { departments },
        "List of all departments retrieved successfully"
      )
    );
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;

  const existingDepartment = await Department.findById(departmentId);

  if (!existingDepartment) {
    throw new ApiError(404, "Department not found");
  }

  await Department.findByIdAndDelete(departmentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Department deleted successfully"));
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { departmentId } = req.params;
  const { departmentName } = req.body;

  const existingDepartment = await Department.findById(departmentId);

  if (!existingDepartment) {
    throw new ApiError(404, "Department not found");
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    departmentId,
    {
      departmentName,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while updating the department"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { department: updatedDepartment },
        "Department updated successfully"
      )
    );
});

export { createDepartment, getAllDepartments, deleteDepartment, updateDepartment };

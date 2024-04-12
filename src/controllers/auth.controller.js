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

const jwtToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = user.generateJWT();

    user.jwtToken = token;
    await user.save({ validateBeforeSave: false });

    return { token };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating JWT token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    department,
    position,
    rfId,
    startDate,
    role,
  } = req.body;

  if (
    [
      firstName,
      lastName,
      email,
      password,
      gender,
      department,
      position,
      rfId,
      startDate,
      role,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const formattedStartDate = formattedDate(startDate);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    department,
    position,
    rfId,
    startDate: formattedStartDate,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -jwtToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { token } = await jwtToken(user._id);

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, token },
        "User registered Successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { token } = await jwtToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -jwtToken"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        token,
      },
      "User logged In Successfully"
    )
  );
});

const checkLoggedInUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not logged in");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: req.user,
      },
      "User is logged in"
    )
  );
});

export { registerUser, loginUser, checkLoggedInUser };

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.session?.jwtToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -jwtToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid JWT Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid JWT token");
  }
});

export const verifyRole = (requiredRole) =>
  asyncHandler(async (req, _, next) => {
    try {
      if (!req.user || !req.user.role) {
        throw new ApiError(403, "Forbidden: User role not provided");
      }

      if (!requiredRole.includes(req.user.role)) {
        throw new ApiError(403, "Forbidden: Insufficient privileges");
      }

      next();
    } catch (error) {
      throw new ApiError(error.status || 403, error.message || "Forbidden");
    }
  });

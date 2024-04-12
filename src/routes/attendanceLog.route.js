import { Router } from "express";
import {
  createAttendanceLog,
  getAllAttendanceLogs,
} from "../controllers/attendanceLog.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
import { createAttendance } from "../middlewares/attendance.middleware.js";

const router = Router();

router.post("/create-attendance-log", createAttendance, createAttendanceLog);
router.get("/all-attendance-logs", getAllAttendanceLogs);

// router.post("/create-attendance-log", createAttendance, createAttendanceLog);
// router.get("/all-attendance-logs", verifyJWT, verifyRole(["Admin"]), getAllAttendanceLogs);

export default router;

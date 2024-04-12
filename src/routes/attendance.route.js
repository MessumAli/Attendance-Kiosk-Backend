import { Router } from "express";
import { getAllAttendance, createManualAttendance } from "../controllers/attendance.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";
// import { createAttendance } from "../middlewares/attendance.middleware.js";

const router = Router();

router.get("/all-attendance", getAllAttendance);
router.post("/create-manual-attendance", createManualAttendance);

// router.get("/all-attendance", verifyJWT, verifyRole(["Admin"]), getAllAttendance);

export default router;

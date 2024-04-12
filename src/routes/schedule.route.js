import { Router } from "express";
import {
  createSchedule,
  getAllSchedules,
  deleteSchedule,
  updateSchedule
} from "../controllers/schedule.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-schedule", createSchedule);
router.get("/all-schedules/:userId", getAllSchedules);
router.delete("/delete-schedule/:scheduleId", deleteSchedule);
router.put("/update-schedule/:scheduleId", updateSchedule);

// router.post("/create-schedule", verifyJWT, verifyRole(["Admin"]), createSchedule);
// router.get("/all-schedules", verifyJWT, verifyRole(["Admin"]), getAllSchedules);
// router.delete("/delete-schedule/:scheduleId", verifyJWT, verifyRole(["Admin"]), deleteSchedule);
// router.put("/update-schedule/:scheduleId", verifyJWT, verifyRole(["Admin"]), updateSchedule);

export default router;

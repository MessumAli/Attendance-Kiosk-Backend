import { Router } from "express";
import {
  createLeave,
  getAllLeave,
  changeLeaveStatus,
} from "../controllers/leave.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-leave", createLeave);
router.get("/all-leave", getAllLeave);
router.patch("/change-leave-status/:leaveId", changeLeaveStatus);

export default router;

import { Router } from "express";
import {
  createPosition,
  getAllPositions,
  deletePosition,
  updatePosition,
} from "../controllers/position.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-position", createPosition);
router.get("/all-positions", getAllPositions);
router.delete("/delete-position/:positionId", deletePosition);
router.put("/update-position/:positionId", updatePosition);

export default router;

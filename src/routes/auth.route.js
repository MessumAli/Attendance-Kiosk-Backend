import { Router } from "express";
import {
  loginUser,
  registerUser,
  checkLoggedInUser,
} from "../controllers/auth.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logged-in-user", verifyJWT, checkLoggedInUser);

// router.post("/register", verifyJWT, verifyRole(["Admin"]), registerUser);
// router.post("/login", loginUser);
// router.get("/logged-in-user", verifyJWT, checkLoggedInUser);

export default router;

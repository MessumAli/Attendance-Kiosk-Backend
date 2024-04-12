import { Router } from "express";
import {
  getAllUsers,
  toggleSoftDelete,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/all-users", getAllUsers);
router.patch("/update-user/:userId", updateUser);
router.patch("/delete-user/:userId", toggleSoftDelete);

// router.get("/all-users", verifyJWT, verifyRole(["Admin"]), getAllUsers);
// router.patch("/update-user/:userId", verifyJWT, verifyRole(["Admin"]), updateUser);
// router.patch("/delete-user/:userId", verifyJWT, verifyRole(["Admin"]), toggleSoftDelete);

export default router;

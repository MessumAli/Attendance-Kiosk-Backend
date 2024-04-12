import { Router } from "express";
import {
  createDepartment,
  getAllDepartments,
  deleteDepartment,
  updateDepartment,
} from "../controllers/department.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-department", createDepartment);
router.get("/all-departments", getAllDepartments);
router.delete("/delete-department/:departmentId", deleteDepartment);
router.put("/update-department/:departmentId", updateDepartment);

export default router;

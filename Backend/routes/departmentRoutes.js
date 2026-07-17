import express from "express";
import {createDepartment,getDepartments,updateDepartment,deleteDepartment,} from "../controllers/departmentController.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/", authMiddleware,checkPermission("Department_create"),createDepartment);
router.get("/", authMiddleware,checkPermission("Department_view"),getDepartments);
router.put("/:id" , authMiddleware,checkPermission("Department_edit"),updateDepartment);
router.delete("/:id", authMiddleware,checkPermission("Department_delete"),deleteDepartment);

export default router;
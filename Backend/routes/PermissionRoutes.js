import express from "express";

// getDesignationsByRole,getEmployeesByDesignation,
import { createPermission,getPermissions,getSinglePermission,updatePermission,deletePermission,
} from "../controllers/permissionController.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  isAdmin,checkPermission("permission_create"),
  createPermission
);

router.get(
  "/all",
  authMiddleware,
  isAdmin,checkPermission("permission_view"),
  getPermissions
);

router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  getSinglePermission
);

router.put(
  "/update/:id",
  authMiddleware,
  isAdmin,checkPermission("permission_edit"),
  updatePermission
);

router.delete(
  "/delete/:id",
  authMiddleware,
  isAdmin,checkPermission("permission_delete"),
  deletePermission
);

//Dynamic Dropdown APIs 

// router.get(
//   "/designations/:role",
//   authMiddleware,
//   isAdmin,
//   getDesignationsByRole
// );

// router.get(
//   "/employees/:designationId",
//   authMiddleware,
//   isAdmin,
//   getEmployeesByDesignation
// );

export default router;

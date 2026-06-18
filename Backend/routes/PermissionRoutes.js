import express from "express";

// getDesignationsByRole,getEmployeesByDesignation,
import { createPermission,getPermissions,getSinglePermission,updatePermission,deletePermission,
} from "../controllers/permissionController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  isAdmin,
  createPermission
);

router.get(
  "/all",
  authMiddleware,
  isAdmin,
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
  isAdmin,
  updatePermission
);

router.delete(
  "/delete/:id",
  authMiddleware,
  isAdmin,
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















// import express from "express";
// import { createPermission,getPermissions, getSinglePermission, updatePermission, deletePermission,} from "../controllers/permissionController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";
// import { isAdmin } from "../middleware/adminMiddleware.js";
// const router = express.Router();

// router.post("/create", authMiddleware, isAdmin, createPermission);

// router.get("/all", authMiddleware, isAdmin, getPermissions);

// router.get("/:id", authMiddleware, isAdmin, getSinglePermission);

// router.put("/update/:id", authMiddleware, isAdmin, updatePermission);

// router.delete("/delete/:id", authMiddleware, isAdmin, deletePermission);

// export default router;

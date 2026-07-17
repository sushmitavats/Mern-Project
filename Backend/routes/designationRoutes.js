import express from "express";

import { getDesignations,createDesignation,updateDesignation,
  deleteDesignation,
} from "../controllers/designationController.js";
import { checkPermission } from "../middleware/checkPermission.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware,  checkPermission("Designation_view"), getDesignations);

router.post("/",authMiddleware,checkPermission("Designation_create"), createDesignation);

router.put(
  "/:id",authMiddleware,
  checkPermission("Designation_edit"),updateDesignation
);

router.delete("/:id",
  authMiddleware,checkPermission("Designation_delete"),
  deleteDesignation
);

export default router;
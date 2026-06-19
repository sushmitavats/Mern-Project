import express from "express";

import { getDesignations,createDesignation,updateDesignation,
  deleteDesignation,
} from "../controllers/designationController.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.get("/",  checkPermission("Designation_view"), getDesignations);

router.post("/",checkPermission("Designation_create"), createDesignation);

router.put(
  "/:id",
  checkPermission("Designation_edit"),updateDesignation
);

router.delete(
  "/:id",checkPermission("Designation_delete"),
  deleteDesignation
);

export default router;
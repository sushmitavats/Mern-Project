import Permission from "../models/Role.js";

export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const role = req.user.role;

      if (role === "ADMIN") {
        return next();
      }

      const roleData = await Permission.findOne({
        roleName: role,
      });

      if (!roleData) {
        return res.status(403).json({
          message: "Role not found",
        });
      }

      if (
        !roleData.permissions.includes(permission)
      ) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };
};
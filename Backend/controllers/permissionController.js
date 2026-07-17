
import Login from "../models/Login.js";
import Permission from "../models/Permission.js";
export const createPermission = async (req, res) => {
  try {
    let { department,designation,employee,permissions} = req.body;
    // Convert empty values to null
    department = department || null;
    designation = designation || null;
    employee = employee || null;
    const existing =
      await Permission.findOne({
        employee,
        department,
        designation
      });

    if (!department && !designation && !employee) {
      return res.status(400).json({
        success: false,
        message:
          "Select at least one field"
      });
    }

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Permission already exists"
      });
    }

    // Save
    const permission =
      await Permission.create({
        department,
        designation,
        employee,
        permissions
      });
    res.status(201).json({
      success: true,
      data: permission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPermissions = async (req, res) => {
  try {

    const permissions =
      await Permission.find()

        .populate(
          "department",
          "departmentName departmentCode"
        )

        .populate(
          "designation",
          "designationName designationCode"
        )

        .sort({
          createdAt: -1
        });

    // update
    const updatedPermissions =
      await Promise.all(
        permissions.map(async (item) => {
          let employeeData = null;

          if (item.employee) {
            employeeData =
              await Login.findOne({
                employee_code: item.employee
              }).select(
                "employee_code name"
              );
          }
          return {
            ...item.toObject(),
            employeeData
          };
        })
      );
    res.status(200).json({
      success: true,
      data: updatedPermissions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
}
//getting single permission
export const getSinglePermission =
  async (req, res) => {
    try {
      const permission =
        await Permission.findById(
          req.params.id
        )
          .populate(
            "department"
          )
          .populate(
            "designation"
          )
          .populate(
            "employee"
          );

      if (!permission) {
        return res.status(404).json({
          success: false,
          message:
            "Permission Not Found",
        });
      }

      res.status(200).json({
        success: true,
        data: permission,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

//update permission
export const updatePermission =
  async (req, res) => {
    try {
      const updated =
        await Permission.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

//delete
export const deletePermission =
  async (req, res) => {
    try {
      await Permission.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Permission Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


const getUserPermissions =
  async (user) => {
    let permissionData = null;
    // employee specific
    permissionData =
      await Permission.findOne({
        employee:
          user.employee_code
      });
    // department+designation
    if (!permissionData) {
      permissionData =
        await Permission.findOne({
          department:
            user.department?._id,
          designation:
            user.designation?._id
        });
    }
    // department only
    if (!permissionData) {
      permissionData =
        await Permission.findOne({
          department:
            user.department?._id,
          designation: null
        });
    }
    return (
      permissionData
        ?.permissions || []
    );
  };
   export default getUserPermissions;


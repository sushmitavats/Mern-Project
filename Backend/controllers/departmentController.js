import Department from "../models/Department.js";

// Create Department
export const createDepartment = async (
  req,
  res
) => {
  try {
    const { departmentName } = req.body;

    const exists =
      await Department.findOne({
        departmentName,
      });

    if (exists) {
      return res.status(400).json({
        msg: "Department already exists",
      });
    }

    const lastDepartment =
      await Department.findOne().sort({
        departmentId: -1,
      });

    const nextId = lastDepartment
      ? lastDepartment.departmentId + 1
      : 1;

    const department =
      await Department.create({
        departmentId: nextId,
        departmentName,
      });

    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// Get Departments
export const getDepartments =
  async (req, res) => {
    try {
      const departments =
        await Department.find().sort({
          departmentId: 1,
        });

      res.json(departments);
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };

// Update Department
export const updateDepartment =
  async (req, res) => {
    try {
      const department =
        await Department.findByIdAndUpdate(
          req.params.id,
          {
            departmentName:
              req.body.departmentName,
          },
          { new: true }
        );

      res.json(department);
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };

// Delete Department
export const deleteDepartment =
  async (req, res) => {
    try {
      await Department.findByIdAndDelete(
        req.params.id
      );

      res.json({
        msg: "Department Deleted",
      });
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };
import Designation from "../models/Designation.js";
// import Department from "../models/Department.js";

export const createDesignation = async (
  req,
  res
) => {
  try {
    const { designationName,  department,} = req.body;
     console.log(req.body);

      if (!designationName || !department) {
        return res.status(400).json({
         message:
          "Designation and Department are required",
      });
    }

    const lastDesignation =
      await Designation.findOne()
        .sort({ designationCode: -1 });

    let nextCode = 1;

    if (lastDesignation) {
      nextCode =
        Number(
          lastDesignation.designationCode
        ) + 1;
    }

    const designation =
      await Designation.create({
        designationName,
        designationCode: nextCode,
        department,    //missed in first
      });

    res.status(201).json(
      designation
    );
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
   // update
export const updateDesignation =
  async (req, res) => {
    try {
        const {
        designationName,
        department,
      } = req.body;

      const designation =
        await Designation.findByIdAndUpdate(
          req.params.id,
          {
            designationName,
            department,
          },
          { new: true }
        );

      res.json(designation);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };


  // export const getDesignations =
  // async (req, res) => {
  //   try {
  //     const data =
  //       await Designation.find().sort({
  //         createdAt: -1,
  //       });

  //     res.json(data);
  //   } catch (err) {
  //     res.status(500).json({
  //       message: err.message,
  //     });
  //   }
  // };

  export const getDesignations = async (
  req,
  res
) => {
  try {
    const designations =
      await Designation.find()
        .populate(
          "department",
          "departmentName"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      designations
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteDesignation =
  async (req, res) => {
    try {
      await Designation.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Designation Deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };




























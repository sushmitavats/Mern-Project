import express from "express";
import Employee from "../models/EmployeeTable.js";
import Attendance from "../models/Attendance.js";
import Login from "../models/Login.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";
import fs from "fs";
import path from "path";
import upload from "../middleware/uploadProfile.js";
import BankDetails from "../models/BankDetails.js";
import PayrollDetails from "../models/PayrollDetails.js";
import IdentityDetails from "../models/IdentityDetails.js";
// import { saveAddress, getAddress } from "../controllers/addressController.js";
// import EmployeeTable from "../models/EmployeeTable.js";

const router = express.Router();
router.get("/", authMiddleware, checkPermission("Employee_view"),
  async (req, res) => {
    try {
      const matchStage =
        req.user.role === "HR" ||
          req.user.role === "ADMIN"
          ? {
            $or: [
              { isDeleted: false },
              { isDeleted: { $exists: false } },
            ],
          }
          : {
            employee_code: req.user.employee_code,
            $or: [
              { isDeleted: false },
              { isDeleted: { $exists: false } },
            ],
          };
      const data = await Employee.aggregate([
        {
          $match: matchStage,
        },
        {
          $group: {
            _id: "$employee_code",
            employee_code: {
              $first: "$employee_code"
            },
            firstName: {
              $first: "$firstName"
            },
            middleName: {
              $first: "$middleName"
            },
            lastName: {
              $first: "$lastName"
            },
            officialEmail: {
              $first: "$officialEmail"
            },
            personalEmail: {
              $first: "$personalEmail"
            },
            mobile: {
              $first: "$mobile"
            },
            department: {
              $first: "$department"
            },
            designation: {
              $first: "$designation"
            },
            joiningDate: {
              $first: "$joiningDate"
            },
            status: {
              $first: "$status"
            }
          }
        },
        {
          $lookup: {
            from: "logins",
            localField: "employee_code",
            foreignField: "employee_code",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        //designation and department
        {
          $lookup: {
            from: "departments",
            localField: "department",
            foreignField: "_id",
            as: "departmentData"
          }
        },
        {
          $unwind: {
            path: "$departmentData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "designations",
            localField: "designation",
            foreignField: "_id",
            as: "designationData"
          }
        },
        {
          $unwind: {
            path: "$designationData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            employee_code: 1,
            firstName: 1,
            middleName: 1,
            lastName: 1,
            officialEmail: 1,
            personalEmail: 1,
            mobile: 1,
            department: {
              _id: "$departmentData._id",
              departmentName: "$departmentData.departmentName"
            },
            designation: {
              _id: "$designationData._id",
              designationName: "$designationData.designationName"
            },
            joiningDate: 1,
            status: "$user.status",
            role: "$user.role"
          }
        },
        {
          $sort: {
            employee_code: 1,
          },
        },
      ]);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

//search 
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const search =
      req.query.search || "";
    const matchStage =
      req.user.role === "HR" ||
        req.user.role === "ADMIN"
        ? {
          $or: [
            {
              employee_code: {
                $regex: search,
                $options: "i",
              },
            },
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
          ],
          $and: [
            {
              $or: [
                { isDeleted: false },
                {
                  isDeleted: {
                    $exists: false,
                  },
                },
              ],
            },
          ],
        }
        : {
          employee_code:
            req.user.employee_code,
          $or: [
            {
              employee_code: {
                $regex: search,
                $options: "i",
              },
            },
            {
              name: {
                $regex: search,
                $options: "i",
              },
            },
          ],
          $and: [
            {
              $or: [
                { isDeleted: false },
                {
                  isDeleted: {
                    $exists: false,
                  },
                },
              ],
            },
          ],
        };

    const employees =
      await Employee.find(matchStage)
        .select("employee_code name")
        .limit(10);
    res.json(employees);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}
);

router.get("/next-code", async (req, res) => {
  try {
    const latestEmployee =
      await Employee
        .findOne()
        .sort({
          createdAt: -1
        });
    let nextNumber = 1;
    if (latestEmployee) {
      const match = latestEmployee.employee_code.match(
        /EMP(\d+)/
      );
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }
    const code =
      `EMP${String(
        nextNumber
      ).padStart(3, "0")}`;
    res.json({
      code
    });
  }
  catch (err) {
    res.status(500).json({
      message: "Server Error"
    })
  }
});
// add empoyee
router.post("/", authMiddleware, checkPermission("Employee_create"), async (req, res) => {
  try {
    const exists = await Employee.findOne({
      employee_code: req.body.employee_code,
    });
    if (exists) {
      return res.status(400).json({ msg: "Employee already exists" });
    }
    const employee = new Employee(req.body);
    const saved = await employee.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// edit(put)
router.put("/code/:employee_code",
  authMiddleware, checkPermission("Employee_edit"),
  async (req, res) => {
    try {
      console.log("PARAMS:", req.params);
      console.log("BODY:", req.body);
      //condition
      if (
        req.body.contact &&
        !/^[0-9]{10}$/.test(
          req.body.contact
        )
      ) {
        return res.status(400).json({
          message:
            "Contact number should be 10 digits"
        });
      }
      if (
        req.body.aadhaar &&
        !/^[0-9]{12}$/.test(
          req.body.aadhaar
        )
      ) {
        return res.status(400).json({
          message:
            "Aadhaar should be 12 digits"
        });
      }
      if (
        req.body.pan &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
          req.body.pan.toUpperCase()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid PAN number"
        });
      }
      const updated =
        await Employee.findOneAndUpdate(
          { employee_code: req.params.employee_code },
          {
            $set: {
              contact: req.body.contact,
              bankAccount: req.body.bankAccount,
              pfAccount: req.body.pfAccount,
              joiningDate: req.body.joiningDate,
              relievingDate: req.body.relievingDate,
              address: req.body.address,
              gender: req.body.gender,
              dob: req.body.dob,
              emergencyContact: req.body.emergencyContact,
              aadhaar: req.body.aadhaar,
              pan: req.body.pan,
              department: req.body.department,
              designation: req.body.designation,
              status: req.body.status,
            }
          },
          {
            new: true
          }
        );
      await Login.findOneAndUpdate(
        {
          employee_code:
            req.params.employee_code
        },
        {
          department: req.body.department,
          designation: req.body.designation,
          status: req.body.status
        }
      );
      if (!updated) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }
      res.json(updated);
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

//delete employee
router.delete("/code/:employee_code", authMiddleware, checkPermission("Employee_delete"),
  async (req, res) => {
    try {
      const employeeCode = req.params.employee_code;
      const employee = await Employee.findOneAndUpdate(
        { employee_code: req.params.employee_code },
        { isDeleted: true },
        { returnDocument: "after", }
      );
      if (!employee) {
        return res.status(404).json({
          message: "Employee not found"
        });
      }
      await Attendance.deleteMany({
        employee_code: employeeCode,
      });
      res.json({
        success: true,
        message: "Employee and Attendance deleted successfully"
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

//for Startus change
router.put(
  "/status/:employee_code",
  authMiddleware,
  checkPermission("Employee_create"),
  // checkPermission("Employee_edit"),
  async (req, res) => {
    try {
      const { status } = req.body;
      await Promise.all([
        Employee.findOneAndUpdate(
          {
            employee_code: req.params.employee_code,
          },
          {
            status
          }
        ),
        Login.findOneAndUpdate(
          { employee_code: req.params.employee_code },
          {
            status
          }
        )
      ]);
      res.json({
        success: true,
        message: "Status updated successfully"
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

//added for page
router.get("/:employee_code", authMiddleware, async (req, res) => {
  try {
    const employee =
      await Employee.findOne({
        employee_code: req.params.employee_code
      })
        .populate("department")
        .populate("designation");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }
    const identity = await IdentityDetails.findOne({
      employee_code: req.params.employee_code
    });
    const bank = await BankDetails.findOne({
      employee_code: req.params.employee_code
    });
    const payroll = await PayrollDetails.findOne({
      employee_code: req.params.employee_code
    });
    // Convert Identity to Object
    const identityData = identity ? identity.toObject() : {};
    delete identityData._id;
    delete identityData.__v;
    const bankData = bank ? bank.toObject() : {};
    delete bankData._id;
    delete bankData.__v;
    const payrollData = payroll ? payroll.toObject() : {};
    delete payrollData._id;
    delete payrollData.__v;
    // Merge Identity Data
    const employeeData = {
      ...employee.toObject(),
      ...identityData,
      ...bankData,
      ...payrollData,

    };
    // bank document cheque
    const BASE_URL =
      `${req.protocol}://${req.get("host")}`;

    if (employeeData.profilePhoto) {
      employeeData.profilePhoto =
        `${BASE_URL}${employeeData.profilePhoto}`;
    }
    // Convert Document URLs
    employeeData.cancelledCheque = [];
    if (bank && bank.cancelledCheque &&
      bank.cancelledCheque.length > 0) {
      employeeData.cancelledCheque =
        bank.cancelledCheque.map((doc) => ({
          _id: doc._id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          filePath: `${BASE_URL}${doc.filePath}`
        }));
    }
    // Convert Document URLs of identity page
    employeeData.documents = [];

    if (
      identity &&
      identity.documents &&
      identity.documents.length > 0
    ) {

      employeeData.documents =
        identity.documents.map((doc) => ({
          _id: doc._id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          filePath: `${BASE_URL}${doc.filePath}`
        }));

    }
    console.log(employeeData.cancelledCheque);
    return res.json(employeeData);
    // res.json(employeeData);
  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
});
//draft router m
router.post("/draft", authMiddleware, upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "cancelledCheque", maxCount: 6 },
  { name: "identityDocuments", maxCount: 6 }
]),
  async (req, res) => {
    try {
      let body = { ...req.body };

      delete body._id;
      delete body.__v;

      delete body.aadhaar;
      delete body.pan;
      delete body.passport;
      delete body.drivingLicense;
      delete body.uan;
      delete body.pfNumber;
      delete body.esic;

      if (req.files?.profilePhoto) {
        body.profilePhoto =
          `/uploads/profile/${req.files.profilePhoto[0].filename}`;
      }
      // if (req.files?.cancelledCheque) {
      //   body.cancelledCheque =
      //     `/uploads/cancelledCheque/${req.files.cancelledCheque[0].filename}`;
      // }
      const oldEmployee =
        await Employee.findOne({
          employee_code: body.employee_code
        });

      if (req.files?.profilePhoto &&
        oldEmployee?.profilePhoto
      ) {
        const oldPath = path.join(
          process.cwd(),
          oldEmployee.profilePhoto.replace(/^\/+/, "")
        );
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      const employee =
        await Employee.findOneAndUpdate(
          { employee_code: body.employee_code },
          {
            ...body,
            draft: true
          },
          {
            returnDocument: "after",
            upsert: true
          }
        );
      // Identity Documents
      const existingIdentity = await IdentityDetails.findOne({
        employee_code: body.employee_code
      });
      let identityDocuments = [];
      if (existingIdentity && existingIdentity.documents) {
        identityDocuments = [
          ...existingIdentity.documents
        ];
      }
      if (req.files?.identityDocuments) {
        if (identityDocuments.length + req.files.identityDocuments.length > 6) {
          return res.status(400).json({
            message:
              "Maximum 6 identity documents allowed."
          });
        }
        const newDocuments =
          req.files.identityDocuments.map(
            file => ({
              fileName:
                file.originalname,
              filePath:
                `/uploads/identity/${file.filename}`,
              fileType:
                file.mimetype,
            })
          );
        identityDocuments.push(
          ...newDocuments
        );
      }

      //bank work started
      const existingBank = await BankDetails.findOne({
        employee_code: body.employee_code
      });
      let chequeDocuments = [];

      if (existingBank && existingBank.cancelledCheque) {
        chequeDocuments = [...existingBank.cancelledCheque];
      }
      if (req.files?.cancelledCheque) {
        if (chequeDocuments.length + req.files.cancelledCheque.length > 6) {
          return res.status(400).json({
            message:
              "Maximum 6 cancelled cheque documents allowed."
          });
        }
        const newDocuments =
          req.files.cancelledCheque.map(file => ({
            fileName: file.originalname,
            filePath:
              `/uploads/cancelledCheque/${file.filename}`,
            fileType: file.mimetype
          }));
        chequeDocuments.push(...newDocuments);
      }
      //identity document array
      await IdentityDetails.findOneAndUpdate(
        {
          employee_code: body.employee_code
        },
        {
          employee_code: body.employee_code,
          aadhaar: body.aadhaar,
          pan: body.pan,
          passport: body.passport,
          drivingLicense: body.drivingLicense,
          uan: body.uan,
          pfNumber: body.pfNumber,
          esic: body.esic,
          documents: identityDocuments
        },
        {
          upsert: true,
          new: true
        }
      );
      //bank
      await BankDetails.findOneAndUpdate(
        {
          employee_code: body.employee_code
        },
        {
          employee_code: body.employee_code,
          accountHolder: body.accountHolder,
          bankName: body.bankName,
          accountNumber: body.accountNumber,
          ifsc: body.ifsc,
          branch: body.branch,
          upi: body.upi,
          cancelledCheque: chequeDocuments
        },
        {
          upsert: true,
          new: true
        }
      );
      // payroll
      await PayrollDetails.findOneAndUpdate(
        {
          employee_code: body.employee_code
        },
        {
          employee_code: body.employee_code,
          ctc: body.ctc,
          payrollGroup: body.payrollGroup,
          salaryEffectiveDate: body.salaryEffectiveDate,
          basicSalary: body.basicSalary,
          hra: body.hra,
          allowances: body.allowances,
          pfDeduction: body.pfDeduction,
          esicDeduction: body.esicDeduction,
          professionalTax: body.professionalTax
        },
        {
          upsert: true,
          returnDocument: "after"
        }
      );
      const employeeData = employee.toObject();
      const BASE_URL =
        `${req.protocol}://${req.get("host")}`;

      if (employeeData.profilePhoto) {
        employeeData.profilePhoto =
          `${BASE_URL}${employeeData.profilePhoto}`;
      }
      employeeData.cancelledCheque =
        chequeDocuments.map(doc => ({
          _id: doc._id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          filePath:
            `${BASE_URL}${doc.filePath}`
        }));

      employeeData.documents =
        identityDocuments.map(doc => ({
          _id: doc._id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          filePath:
            `${BASE_URL}${doc.filePath}`
        }));
      return res.json(employeeData);
      // res.json(employeeData);
    }
    catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  });
// save and next router
router.post("/save", authMiddleware, upload.fields([{ name: "profilePhoto", maxCount: 1 }, { name: "cancelledCheque", maxCount: 6 },{ name: "identityDocuments", maxCount: 6 }]),
 async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("SAVE REQUEST BODY:", req.body);
    if (!req.body.department) {
      console.log("FAILED: department");
      return res.status(400).json({
        message: "Department is required"
      });
    }
    if (!req.body.designation) {
      console.log("FAILED: designation");
      return res.status(400).json({
        message: "Designation is required"
      });
    }

    if (!req.body.joiningDate) {
      console.log("FAILED: joiningDate");
      return res.status(400).json({
        message: "Joining Date is required"
      });
    }
    if (req.body.aadhaar && !/^\d{12}$/.test(req.body.aadhaar)) {
      console.log("FAILED: aadhaar");
      return res.status(400).json({
        message: "Invalid Aadhaar"
      });
    }
    if (req.body.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(req.body.pan.toUpperCase())) {
      console.log("FAILED: pan");
      return res.status(400).json({
        message: "Invalid PAN"
      });
    }
    let body = { ...req.body };
    //removing the updation
    delete body._id;
    delete body.__v;
    // Identity fields are stored in IdentityDetails collection
    delete body.aadhaar;
    delete body.pan;
    delete body.passport;
    delete body.drivingLicense;
    delete body.uan;
    delete body.pfNumber;
    delete body.esic;
    // delete body.createdAt;
    const oldEmployee = await Employee.findOne({
      employee_code: body.employee_code,
    });


    if (req.files?.profilePhoto) {
      body.profilePhoto =
        `/uploads/profile/${req.files.profilePhoto[0].filename}`;
    }

    // Find Existing Bank and Identity Record
    const existingBank = await BankDetails.findOne({
      employee_code: body.employee_code
    });
    const existingIdentity = await IdentityDetails.findOne({
      employee_code: body.employee_code
    });
    // Create Identity Documents Array
    let identityDocuments = [];
    if (
      existingIdentity &&
      existingIdentity.documents
    ) {
      identityDocuments = [
        ...existingIdentity.documents
      ];
    }
    if (req.files?.identityDocuments) {
      if (identityDocuments.length + req.files.identityDocuments.length > 6) {
        return res.status(400).json({
          message:
            "Maximum 6 identity documents allowed."
        });
      }
      const newDocuments =
        req.files.identityDocuments.map(file => ({
          fileName: file.originalname,
          filePath:
            `/uploads/identity/${file.filename}`,
          fileType: file.mimetype
        }));
      identityDocuments.push(...newDocuments);
    }
    // Create Bank Documents Array
    let chequeDocuments = [];
    if (existingBank && existingBank.cancelledCheque) {
      chequeDocuments = [...existingBank.cancelledCheque];
    }
    if (req.files?.cancelledCheque) {
      if (chequeDocuments.length + req.files.cancelledCheque.length > 6) {
        return res.status(400).json({
          message: "Maximum 6 cancelled cheque documents allowed."
        });
      }
      const newDocuments =
        req.files.cancelledCheque.map(file => ({
          fileName: file.originalname,
          filePath:
            `/uploads/cancelledCheque/${file.filename}`,
          fileType: file.mimetype
        }));
      chequeDocuments.push(...newDocuments);
    }
    const employee = await Employee.findOneAndUpdate(
      { employee_code: body.employee_code, },
      {
        ...body,
        draft: false,
      },
      {
        returnDocument: "after",
        upsert: true
      }
    );
    // Delete old image only after database update
    if (req.files?.profilePhoto && oldEmployee?.profilePhoto && oldEmployee.profilePhoto !== employee.profilePhoto) {
      const oldPath = path.join(
        process.cwd(),
        oldEmployee.profilePhoto.replace(/^\/uploads/, "uploads")
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    // Save Identity Details
    await IdentityDetails.findOneAndUpdate(
      {
        employee_code: body.employee_code
      },
      {
        employee_code: body.employee_code,
        aadhaar: req.body.aadhaar,
        pan: req.body.pan,
        passport: req.body.passport,
        drivingLicense: req.body.drivingLicense,
        uan: req.body.uan,
        pfNumber: req.body.pfNumber,
        esic: req.body.esic,
        documents: identityDocuments
      },
      {
        upsert: true,
        new: true
      }
    );
    await BankDetails.findOneAndUpdate(
      {
        employee_code: body.employee_code
      },
      {
        employee_code: body.employee_code,
        accountHolder: body.accountHolder,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        ifsc: body.ifsc,
        branch: body.branch,
        upi: body.upi,
        cancelledCheque: chequeDocuments
      },
      {
        upsert: true,
        new: true
      }
    );
    await PayrollDetails.findOneAndUpdate(
      {
        employee_code: body.employee_code
      },
      {
        employee_code: body.employee_code,
        ctc: body.ctc,
        payrollGroup: body.payrollGroup,
        salaryEffectiveDate: body.salaryEffectiveDate,
        basicSalary: body.basicSalary,
        hra: body.hra,
        allowances: body.allowances,
        pfDeduction: body.pfDeduction,
        esicDeduction: body.esicDeduction,
        professionalTax: body.professionalTax
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );
    await Login.findOneAndUpdate(
      {
        employee_code:
          employee.employee_code
      },
      {
        name:
          `${employee.firstName} ${employee.lastName}`,
        email:
          employee.officialEmail,
        employee_code:
          employee.employee_code,
        department:
          employee.department,
        designation:
          employee.designation,
        joiningDate:
          employee.joiningDate,
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );

    const employeeData = employee.toObject();
    const BASE_URL =
      `${req.protocol}://${req.get("host")}`;
    if (employeeData.profilePhoto) {
      employeeData.profilePhoto =
        `${BASE_URL}${employeeData.profilePhoto}`;
    }
    // it is for bank document
    employeeData.cancelledCheque =
      chequeDocuments.map(doc => ({
        _id: doc._id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        filePath:
          `${BASE_URL}${doc.filePath}`
      }));
    // Return Documents to Frontend
    employeeData.documents =
      identityDocuments.map(doc => ({
        _id: doc._id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        filePath:
          `${BASE_URL}${doc.filePath}`
      }));
    return res.json(employeeData);
    // res.json(employeeData)
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
});

// delete document
router.delete("/bank-document/:employee_code/:documentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { employee_code, documentId } = req.params;
      const bank = await BankDetails.findOne({
        employee_code
      });

      if (!bank) {
        return res.status(404).json({
          message: "Bank details not found."
        });
      }
      const document =
        bank.cancelledCheque.id(documentId);

      if (!document) {
        return res.status(404).json({
          message: "Document not found."
        });
      }
      // Delete file from uploads folder
      const filePath = path.join(
        process.cwd(),
        document.filePath.replace(/^\/+/, "")
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      // Remove document from array
      bank.cancelledCheque.pull(documentId);
      await bank.save();

      res.json({
        success: true,
        message: "Document deleted successfully.",
        cancelledCheque: bank.cancelledCheque
      });
    }
    catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message
      });
    }
  }
);

//deletion in identity page
router.delete("/identity-document/:employee_code/:documentId",authMiddleware,
  async (req, res) => {
    try {
      const { employee_code, documentId } = req.params;
      const identity =
        await IdentityDetails.findOne({
          employee_code
        });
      if (!identity) {
        return res.status(404).json({
          message: "Identity details not found."
        });
      }
      const document =
        identity.documents.id(documentId);
      if (!document) {
        return res.status(404).json({
          message: "Document not found."
        });
      }
      // Delete file from uploads folder
      const filePath = path.join(
        process.cwd(),
        document.filePath.replace(/^\/+/, "")
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      // Remove document from MongoDB
      identity.documents.pull(documentId);
      await identity.save();
      res.json({
        success: true,
        message: "Document deleted successfully.",
        documents: identity.documents
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: err.message
      });
    }
  }
);

export default router;



import Employee from "../models/EmployeeTable.js";
//    Save Address
export const saveAddress = async (req, res) => {
    try {
        const {
            employee_code,
            currentAddress,
            permanentAddress,
            pincode
        } = req.body;
        const errors = {};
        // Required Validation
        if (!currentAddress?.trim()) {
            errors.currentAddress = "Current Address is required";
        }
        if (!permanentAddress?.trim()) {
            errors.permanentAddress = "Permanent Address is required";
        }
        if (!pincode?.trim()) {
            errors.pincode = "Pincode is required";
        }
        else if (!/^[0-9]{6}$/.test(pincode)) {
            errors.pincode = "Pincode must be exactly 6 digits";
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                errors
            });
        }
        const employee = await Employee.findOne({
            employee_code
        });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        employee.currentAddress = currentAddress;
        employee.permanentAddress = permanentAddress;
        employee.pincode = pincode;
        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Address saved successfully",
            data: employee
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
  //Get Addres
export const getAddress = async (req, res) => {
    try {
        const employee =
            await Employee.findOne({
                employee_code: req.params.employee_code
            });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        res.json({
            currentAddress:
                employee.currentAddress,
            permanentAddress:
                employee.permanentAddress,
            pincode:
                employee.pincode
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
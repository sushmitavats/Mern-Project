import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
{
    employee_code:{
        type:String,
        required:true,
        unique:true
    },
    ctc:{
        type:Number,
        required:true
    },
    payrollGroup:{
        type:String,
        required:true
    },
    salaryEffectiveDate:{
        type:Date,
        required:true
    },
    basicSalary:Number,
    hra:Number,
    allowances:String,
    pfDeduction:Number,
    esicDeduction:Number,
    professionalTax:Number
},
{
    timestamps:true
});

export default mongoose.model(
    "PayrollDetails",
    payrollSchema
);
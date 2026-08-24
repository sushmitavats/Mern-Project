import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    holidayName: {
      type: String,
      required: true,
    },
    holidayDate: {
      type: String, // YYYY-MM-DD
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {timestamps: true,}
);
export default mongoose.model("Holiday", holidaySchema);























// import mongoose from "mongoose";

// const holidaySchema = new mongoose.Schema(
//   {
//     holidayName: String,
//     holidayDate: String,
//   },
//   {
//     timestamps: true,
//   }
// );
// export default mongoose.model(
//   "Holiday",
//   holidaySchema
// );
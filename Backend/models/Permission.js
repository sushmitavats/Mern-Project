import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    // default: null,
  },

  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
    // default: null,
  },
  employee: {
    type: String,
    // default: null,
  },
  permissions: [
    {
      type: {
        type: String,
        required: true,
      },

      view: {
        type: Boolean,
        default: false,
      },

      create: {
        type: Boolean,
        default: false,
      },

      edit: {
        type: Boolean,
        default: false,
      },

      delete: {
        type: Boolean,
        default: false,
      },
    },
  ],
},
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Permission",
  permissionSchema
);





















































// import mongoose from "mongoose";

// const permissionSchema = new mongoose.Schema(
//   {
//     roleName: {
//       type: String,
//       enum: ["ADMIN", "HR", "EMPLOYEE"],
//       required: true,
//       unique: true,
//     },

//     permissions: [
//       {
//         type: String,
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Permission", permissionSchema);

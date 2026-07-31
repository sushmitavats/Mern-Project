import Permission from "../models/Permission.js";
export const checkPermission =
(permissionName) => {

  return async ( req,res,next) => {
    try {
      if (!req.user) {
        return res
        .status(401)
        .json({success:false, message:"Unauthorized"
        });
      }
      // ADMIN bypass only
      if(req.user.role==="ADMIN" ){
        return next();
      }
      const [module,action] =
      permissionName.split("_");
      let permissionDoc=null;
      // Employee specific
      permissionDoc =await Permission.findOne({
        employee: req.user.employee_code
      });
      // Department + designation
      if(!permissionDoc){
        permissionDoc = await Permission.findOne({
          department:
          req.user.department,
          designation:
          req.user.designation,
          employee:null
        });
      }
      // Department only
      if(!permissionDoc){
        permissionDoc =
        await Permission.findOne({
          department:
          req.user.department,
          designation:null,
          employee:null
        });
      }
      if(!permissionDoc){
        return res
        .status(403)
        .json({
          success:false,
          message:
          "No permission assigned"
        });
      }
      const modulePermission =
      permissionDoc.permissions.find(
        p=>
        p.type.toLowerCase()===
        module.toLowerCase()
      );
      if(
        !modulePermission ||
        !modulePermission[
          action.toLowerCase()
        ]
      ){
        return res
        .status(403)
        .json({
          success:false,
          message:
          `No ${action} permission for ${module}`
        });
      }
      next();
    }
    catch(error){
      res.status(500).json({
        success:false,
        message:error.message
      });
    }
  }
}











// import Permission from "../models/Permission.js";

// export const checkPermission =
//     (permissionName) => {
//         return async (req, res, next) => {
//             try {
//                 if (!req.user) {
//                   return res.status(401).json({
//                         success: false,
//                         message: "Unauthorized"
//                     });
//                 }
//                 if (req.user.role === "ADMIN") {

//                     return next();
//                 }
//                 const [module, action] =
//                     permissionName.split("_");
//                 let permissionDoc = null;
//                 // employee specific
//                 permissionDoc =
//                     await Permission.findOne({
//                         employee:
//                             req.user.employee_code
//                     });
//               // department + designation
//                 if (!permissionDoc) {
//                     permissionDoc =
//                         await Permission.findOne({
//                             department:
//                                 req.user.department,
//                             designation:
//                                 req.user.designation,
//                             employee: null
//                         });
//                 }
//                 // department only
//                 if (!permissionDoc) {
//                     permissionDoc =
//                         await Permission.findOne({
//                             department:
//                                 req.user.department,
//                             designation: null,
//                             employee: null
//                         });
//                 }
//                 if (!permissionDoc) {
//                  return res.status(403).json({
//                         success: false,
//                         message: "No permission assigned"
//                     });
//                 }
//                 const modulePermission =
//                     permissionDoc.permissions.find(
//                         p =>
//                             p.type.toLowerCase()
//                             === module.toLowerCase()
//                     );
//                 if (
//                     !modulePermission ||
//                     !modulePermission[
//                     action.toLowerCase()
//                     ]
//                 ) {
//                     return res.status(403).json({
//                         success: false,
//                         message:
//                             `No ${action} permission`
//                     });
//                 }
//                 next();
//             }
//             catch (error) {
//                 return res.status(500).json({
//                     success: false,
//                     message: error.message
//                 });
//             }
//         };
//     };
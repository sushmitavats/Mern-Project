import Permission from "../models/Permission.js";

export const checkPermission = (permissionName) => {

    return async(req,res,next)=>{

        try{

            if(req.user.role==="ADMIN"){
                return next();
            }

            const [module,action] =
            permissionName.split("_");

            console.log(
                "Module:",module,
                "Action:",action
            );

            // First try employee-specific permission
            let permissionDoc =
            await Permission.findOne({
                employee:req.user.employee_code
            });

            // If employee permission not found then use designation/department
            if(!permissionDoc){

                permissionDoc =
                await Permission.findOne({
                    department:req.user.department,
                    designation:req.user.designation,
                    employee:null
                });

            }

            console.log(
                "PermissionDoc:",
                permissionDoc
            );

            if(!permissionDoc){

                return res.status(403).json({
                    success:false,
                    message:"No permission assigned"
                });

            }

            const modulePermission =
            permissionDoc.permissions.find(
                p =>
                p.type.toLowerCase()===
                module.toLowerCase()
            );

            console.log(
                "modulePermission:",
                modulePermission
            );

            if(
                !modulePermission ||
                modulePermission[
                    action.toLowerCase()
                ]!==true
            ){

                return res.status(403).json({
                    success:false,
                    message:
                    `No ${action.toUpperCase()} permission for ${module.toUpperCase()}`
                });

            }

            next();

        }
        catch(error){

            console.log(error);

            return res.status(500).json({
                success:false,
                message:error.message
            });
        }
    }
};

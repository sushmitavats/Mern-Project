import { Navigate } from "react-router-dom";
import { hasPermission } from "./utils/hasPermission";

export default function ProtectedRoute({
   children,
   module
}){

   if(
      module &&
      !hasPermission(
         module,
         "view"
      )
   ){
      return (
         <Navigate
            to="/dashboard"
         />
      );
   }

   return children;
}












// import { Navigate } from "react-router-dom";
// import { hasPermission } from "./utils/hasPermission";

// export default function ProtectedRoute({
//   children,
//   permission
// }) {

//   const token =
//     localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (
//     permission &&
//     !hasPermission(permission)
//   ) {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// }
















// import { Navigate } from "react-router-dom";
// import { hasPermission } from "./utils/hasPermission";

// export default function ProtectedRoute({
//   children,
//   permission,
// }) {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }
  
//   if (permission && !hasPermission(permission)) {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// }

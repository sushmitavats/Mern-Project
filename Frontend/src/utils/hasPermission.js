export const hasPermission = (permissionName) => {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) return false;

  // ADMIN gets all permissions
  if (user.role === "ADMIN") {
    return true;
  }

  if (!permissionName) {
    return true;
  }

  // Example:
  // "Employee_view"
  const [module, action] =
    permissionName.split("_");

  return user?.permissions?.some(
    p =>
      p.type.toLowerCase() === module.toLowerCase()
      &&
      p[action.toLowerCase()] === true
  );

};










// export const hasPermission = (permission) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!user) return false;


//   if (user.role === "ADMIN") {
//     return true;
//   }

//   if (!permission) {
//     return true;
//   }

//   return user.permissions?.includes(permission);
// };
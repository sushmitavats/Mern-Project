export const hasPermission = (permission) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return false;


  if (user.role === "ADMIN") {
    return true;
  }

  if (!permission) {
    return true;
  }

  return user.permissions?.includes(permission);
};
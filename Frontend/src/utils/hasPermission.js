export const hasPermission = (moduleName,action) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ADMIN bypass
  const roleName =
    typeof user?.role === "string"
      ? user.role
      : user?.role?.name;

  if (roleName?.toUpperCase() ==="ADMIN"){
    return true;
  }

  const permissions =
    JSON.parse(
      localStorage.getItem(
        "permissions"
    )
    ) || [];

  console.log(
    "Stored permissions:",
    permissions
  );

  const modulePermission =
    permissions.find(
      (p) =>
        p.type?.toLowerCase() ===
        moduleName?.toLowerCase()
    );

  console.log(
    "Found module:",
    modulePermission
  );

  return (
    modulePermission?.[
      action
    ] || false
  );
};
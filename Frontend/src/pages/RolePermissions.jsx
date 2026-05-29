
import React, { useEffect, useState } from "react";
import PermissionModal from "../components/PermissionModal";
import { getRoles,deleteRoleById,} from "../api";

const RolePermissions = () => {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);

      const res = await getRoles();

      setPermissions(res.data.data || []);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error fetching permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this role permissions?"
      );

      if (!confirmDelete) return;

      await deleteRoleById(id);

      fetchPermissions();

      alert("Role deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold  text-gray-800">
              Roles & Permissions
            </h1>

            <p className="text-gray-500 mt-1">
              Manage system access permissions
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedRole(null);
              setOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
          >
            + Add Role
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Permissions</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-6">
                    Loading...
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6">
                    No Data Found
                  </td>
                </tr>
              ) : (

                permissions.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4 font-medium text-gray-700">
                      {item.roleName}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {item.permissions?.map((perm, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedRole(item);
                            setOpen(true);
                          }}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <PermissionModal
          onClose={() => {
            setOpen(false);
            fetchPermissions();
          }}
          selectedRole={selectedRole}
        />
      )}
    </div>
  );
};

export default RolePermissions;
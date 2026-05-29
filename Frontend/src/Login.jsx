import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, changePassword } from "./api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstLogin, setFirstLogin] = useState(false);

  const navigate = useNavigate();


  const handleLogin = async () => {
    try {

      const res = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      console.log("LOGIN SUCCESS:", res.data);

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      if (
        res.data.firstLogin &&
        res.data.user.role !== "ADMIN"
      ) {

        // DON'T CLEAR OLD PASSWORD

        setNewPassword("");
        setConfirmPassword("");

        setFirstLogin(true);

      } else {
        navigate("/dashboard");
      }
    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.msg ||
        "Login Failed"
      );
    }
  };
  // CHANGE PASSWORD
  const handlePasswordChange = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        return alert("All fields are required");
      }

      if (newPassword !== confirmPassword) {
        return alert("Passwords do not match");
      }

      const user = JSON.parse(localStorage.getItem("user"));

      await changePassword({
        oldPassword: password,
        newPassword,
        confirmPassword,
        userId: user?.id,
      });
      alert("Password Changed Successfully");

      // clear fields
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setFirstLogin(false);

      // REMOVE OLD TOKEN
      localStorage.clear();

      // GO TO LOGIN
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.msg || "Password change failed");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#f5f7f6]">

      {/* LEFT SIDE */}
      <div className="relative w-1/2 flex items-center">
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(12,74,69,0.88)",
            transform: "skewX(-12deg) translateX(-8%)",
            transformOrigin: "top left",
            width: "125%",
          }}
        />

        <div className="relative z-10 px-20 text-white">
          <h1 className="text-4xl font-bold mb-6">
            Enterprise HR Portal
          </h1>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white w-[420px] p-10 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl text-[#38b2ac]">
              {firstLogin ? "Change Password" : "Welcome Back"}
            </h2>

            {firstLogin && (
              <button
                onClick={() => {
                  setFirstLogin(false);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-gray-500 text-2xl font-bold"
              >
                ×
              </button>
            )}

          </div>

          {/* LOGIN */}
          {!firstLogin ? (
            <>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border p-2 mb-4 rounded"
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  className="w-full border p-2 rounded pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                onClick={() => {
                  console.log("BUTTON PRESSED");
                  handleLogin();
                }}
                className="w-full bg-[#34b7a7] text-white py-2 rounded"
              >
                Login
              </button>
            </>
          ) : (
            <>
              {/* NEW PASSWORD */}
              <div className="relative mb-4">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  className="w-full border p-2 rounded pr-10"
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative mb-6">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  className="w-full border p-2 rounded pr-10"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                onClick={handlePasswordChange}
                className="w-full bg-cyan-500 text-white py-2 rounded"
              >
                Update Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}







































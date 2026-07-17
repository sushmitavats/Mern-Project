import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, changePassword } from "./api";
import qubixlBg from "./assets/qubixl-bg.jpg";
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock} from "react-icons/fa";

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

    localStorage.setItem(
      "permissions",
      JSON.stringify(
        res.data.permissions || []
      )
    );
    console.log(
      "Saved permissions:",
      JSON.parse(
        localStorage.getItem("permissions")
      )
    );

    if (res.data.firstLogin && res.data.user?.role !== "ADMIN") {
      setNewPassword("");
      setConfirmPassword("");
      setFirstLogin(true);
    } else {
      // use replace to avoid back button issue
      navigate("/dashboard", {
        replace: true
      });
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
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    if (!firstLogin) {
      handleLogin();
    } else {
      handlePasswordChange();
    }
  };
  return (
    <div className="h-screen flex overflow-hidden bg-[#edf2f7]">

      {/* LEFT SIDE */}

      <div
        className="w-1/2 relative bg-cover bg-center --tw-bg-opacity: 3;"
        style={{
          backgroundImage: `url(${qubixlBg})`,
        }}
      >
        {/* light overlay */}
        <div className="absolute inset-0 bg-white/50" />
        <div className="absolute left-14 top-[28%] z-10">
          <h1 className="text-[54px] leading-[60px] font-bold text-[#0e2940]">
            Enterprise
            <br />
            HR Portal
          </h1>
          <div className="w-16 h-[3px] bg-[#16b7af] mt-6 mb-6" />
          <p className="text-[#22394d] text-[22px] font-medium leading-10">
            Secure workforce management, attendance, payroll
            <br />
            and project visibility-all in one platform.
          </p>
        </div>
      </div>
      {/* RIGHT SIDE */}

      <div className="w-1/2 flex items-center justify-center">

        <div
          className="w-[420px]
bg-white
rounded-[25px]
px-10
py-10
shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          <form onSubmit={handleSubmit}>
            {/* Heading */}
            <h2 className="text-center text-[38px] font-bold text-[#16b7af]">
              {
                firstLogin
                  ?
                  "Change Password"
                  :
                  "Welcome"
              }
            </h2>
            <p className="text-center text-gray-500 text-sm mt-2 mb-8">
              {
                firstLogin
                  ?
                  "Create your new password"
                  :
                  "Sign in to your account"
              }
            </p>
            {
              !firstLogin
                ?
                <>
                  {/* Email */}
                  <label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative mt-2 mb-6">
                    <FaEnvelope
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="name@qubixl.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
w-full
h-[52px]
rounded-xl
border
border-gray-200
pl-12
pr-4
outline-none
focus:ring-2
focus:ring-[#16b7af]
"
                    />
                  </div>
                  {/* Password */}
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-2 mb-8">
                    <FaLock
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <input
                      type={
                        showPassword
                          ?
                          "text"
                          :
                          "password"
                      }
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="
w-full
h-[52px]
rounded-xl
border
border-gray-200
pl-12
pr-12
outline-none
focus:ring-2
focus:ring-[#16b7af]
"
            />
                    <div
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="
absolute
right-4
top-4
cursor-pointer
text-gray-400
"
                    >
                      {
                        showPassword
                          ?
                          <FaEyeSlash />
                          :
                          <FaEye />
                      }
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="
w-full
h-[50px]
rounded-xl
bg-[#16b7af]
hover:bg-[#0e9c95]
font-semibold
text-white
duration-300
"
                  >
                    Login
                  </button>
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                      Forgot password? Contact Admin
                    </p>
                    <p className="text-xs text-gray-400 mt-8">
                      © 2026 Qubixl Private Limited
                    </p>
                  </div>
                </>
                :
                <>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setFirstLogin(false)
                        setNewPassword("")
                        setConfirmPassword("")
                      }}
                      className="text-2xl text-gray-400"
                    >
                      ×
                    </button>
                  </div>
                  <label className="text-sm font-semibold">
                    New Password
                  </label>
                  <div className="relative mt-2 mb-5">
                    <input
                      type={
                        showNewPassword
                          ?
                          "text"
                          :
                          "password"
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      className=" w-full
h-[52px]
rounded-xl
border
pl-4
pr-12"
                    />

                    <div
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="absolute right-4 top-4 cursor-pointer"
                    >

                      {
                        showNewPassword
                          ?
                          <FaEyeSlash />
                          :
                          <FaEye />
                      }

                    </div>

                  </div>



                  <label className="text-sm font-semibold">

                    Confirm Password

                  </label>

                  <div className="relative mt-2 mb-8">

                    <input
                      type={
                        showConfirmPassword
                          ?
                          "text"
                          :
                          "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className="
w-full
h-[52px]
rounded-xl
border
pl-4
pr-12"
                    />


                    <div
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-4 cursor-pointer"
                    >

                      {
                        showConfirmPassword
                          ?
                          <FaEyeSlash />
                          :
                          <FaEye />
                      }

                    </div>

                  </div>



                  <button
                    type="submit"
                    className="
w-full
h-[50px]
rounded-xl
bg-[#16b7af]
text-white
font-semibold
"
                  >

                    Update Password

                  </button>
                </>
            }

          </form>
        </div>
      </div>
    </div>
  );
}

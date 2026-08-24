import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser, changePassword } from "./api";
import qubixlBg from "./assets/qubixl-bg.jpg";
import { FaEye, FaEyeSlash, FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";

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
      localStorage.setItem("user",JSON.stringify(res.data.user));
      localStorage.setItem("permissions",JSON.stringify(res.data.permissions || []));
      console.log("Saved permissions:",JSON.parse(localStorage.getItem("permissions")));

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
    <div className="min-h-screen bg-[#edf2f7] lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen lg:h-full">

        {/* LEFT SIDE */}

        <div
          className="relative hidden w-1/2 overflow-hidden bg-cover bg-center lg:block"
          style={{
            backgroundImage: `url(${qubixlBg})`,
          }}
        >

          <div className="absolute inset-0 bg-[#08283b]/65" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e2940]/80 via-[#0e5261]/55 to-[#16b7af]/35" />
          <div className="absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full border border-white/10" />
          <div className="relative z-10 flex h-full flex-col justify-between px-14 py-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                <div className="h-5 w-5 rounded-md border-[3px] border-[#16b7af]" />
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-[2px] text-white">
                  QUBIXL
                </h3>
                <p className="text-[9px] font-medium tracking-[3px] text-white/60">
                  TECHNOLOGY
                </p>
              </div>

            </div>


            <div className="max-w-[560px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-[#63e1d9]" />
                <span className="text-xs font-medium tracking-wide text-white/90">
                  SMART WORKFORCE MANAGEMENT
                </span>
              </div>


              <h1 className="text-[54px] font-bold leading-[1.08] tracking-[-1px] text-white">
                Enterprise
                <br />
                <span className="text-[#63e1d9]">
                  HR Portal
                </span>
              </h1>


              <div className="mt-7 h-[3px] w-20 rounded-full bg-[#16b7af]" />
              <p className="mt-7 max-w-[510px] text-[19px] leading-8 text-white/80">
                Secure workforce management, attendance, payroll
                and project visibility — all in one powerful platform.
              </p>


              <div className="mt-9 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16b7af]/20 text-sm text-[#63e1d9]">
                    ✓
                  </span>
                  <span className="text-sm text-white/85">
                    Workforce
                  </span>

                </div>


                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16b7af]/20 text-sm text-[#63e1d9]">
                    ✓
                  </span>
                  <span className="text-sm text-white/85">
                    Attendance
                  </span>

                </div>


                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16b7af]/20 text-sm text-[#63e1d9]">
                    ✓
                  </span>
                  <span className="text-sm text-white/85">
                    Payroll
                  </span>

                </div>

              </div>

            </div>


            <div className="flex items-center justify-between text-xs text-white/50">
              <span>
                © 2026 Qubixl Private Limited
              </span>
              <span>
                Secure • Reliable • Enterprise Ready
              </span>

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="flex w-full items-center justify-center overflow-y-auto bg-[#f6f9fb] px-5 py-8 sm:px-8 lg:w-1/2">
          <div className="w-full max-w-[440px]">
            <div className="rounded-[26px] border border-[#e3ebef] bg-white px-7 py-8 shadow-[0_18px_55px_rgba(14,41,64,0.08)] sm:px-10 sm:py-9">
              <form onSubmit={handleSubmit}>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9f8f7]">
                    <div className="h-6 w-6 rounded-lg border-[3px] border-[#16b7af]" />
                  </div>


                  <h2 className="text-[32px] font-bold tracking-[-0.5px] text-[#0e2940]">
                    {
                      firstLogin
                        ?
                        "Change Password"
                        :
                        "Welcome Back"
                    }

                  </h2>


                  <p className="mt-2 text-sm text-[#718096]">
                    {
                      firstLogin
                        ?
                        "Create your new password"
                        :
                        "Sign in to continue to your account"
                    }
                  </p>

                </div>


                {
                  !firstLogin
                    ?
                    <>
                      <label className="text-sm font-semibold text-[#22394d]">
                        Email Address
                      </label>
                      <div className="relative mt-2 mb-5">
                        <FaEnvelope className="absolute left-4 top-4 text-[#9AA8B5]" />
                        <input
                          type="email"
                          placeholder="name@qubixl.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-[52px] w-full rounded-xl border border-[#dce4ea] bg-[#fbfdfe] pl-12 pr-4 text-[#22394d] outline-none transition placeholder:text-[#a7b2bc] focus:border-[#16b7af] focus:bg-white focus:ring-4 focus:ring-[#16b7af]/10"
                        />

                      </div>


                      <label className="text-sm font-semibold text-[#22394d]">
                        Password
                      </label>

                      <div className="relative mt-2 mb-7">
                        <FaLock className="absolute left-4 top-4 text-[#9AA8B5]" />

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
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-[52px] w-full rounded-xl border border-[#dce4ea] bg-[#fbfdfe] pl-12 pr-12 text-[#22394d] outline-none transition placeholder:text-[#a7b2bc] focus:border-[#16b7af] focus:bg-white focus:ring-4 focus:ring-[#16b7af]/10"
                        />

                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 cursor-pointer text-[#9AA8B5] transition hover:text-[#16b7af]"
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
                        className="h-[52px] w-full rounded-xl bg-[#16b7af] font-semibold text-white shadow-[0_8px_20px_rgba(22,183,175,0.20)] transition duration-300 hover:bg-[#0e9c95]"
                      >
                        Login
                      </button>


                      <div className="mt-7 text-center">
                        <p className="text-sm text-[#718096]">
                          Forgot password? Contact Admin
                        </p>

                        <p className="mt-8 text-xs text-[#a0aec0]">
                          © 2026 Qubixl Private Limited
                        </p>
                      </div>

                    </>

                    :

                    <>

                      <div className="-mr-3 -mt-4 mb-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setFirstLogin(false)
                            setNewPassword("")
                            setConfirmPassword("")
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-2xl text-[#9AA8B5] transition hover:bg-[#eef8f7] hover:text-[#16b7af]"
                        >
                          ×
                        </button>

                      </div>


                      <label className="text-sm font-semibold text-[#22394d]">
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
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="h-[52px] w-full rounded-xl border border-[#dce4ea] bg-[#fbfdfe] pl-4 pr-12 text-[#22394d] outline-none transition focus:border-[#16b7af] focus:bg-white focus:ring-4 focus:ring-[#16b7af]/10"
                        />

                        <div
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-4 cursor-pointer text-[#9AA8B5] transition hover:text-[#16b7af]"
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


                      <label className="text-sm font-semibold text-[#22394d]">
                        Confirm Password
                      </label>

                      <div className="relative mt-2 mb-7">
                        <input
                          type={
                            showConfirmPassword
                              ?
                              "text"
                              :
                              "password"
                          }
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="h-[52px] w-full rounded-xl border border-[#dce4ea] bg-[#fbfdfe] pl-4 pr-12 text-[#22394d] outline-none transition focus:border-[#16b7af] focus:bg-white focus:ring-4 focus:ring-[#16b7af]/10"
                        />

                        <div
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-4 cursor-pointer text-[#9AA8B5] transition hover:text-[#16b7af]"
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
                        className="h-[52px] w-full rounded-xl bg-[#16b7af] font-semibold text-white shadow-[0_8px_20px_rgba(22,183,175,0.20)] transition duration-300 hover:bg-[#0e9c95]"
                      >
                        Update Password
                      </button>

                    </>

                }

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

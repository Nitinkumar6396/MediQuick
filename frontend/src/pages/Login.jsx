import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
  const [state, setState] = useState("login");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setToken, backendUrl, fetchUserData } = useContext(AppContext);

  // send otp
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return toast.error("All fields are required!");
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-otp`, { email });
      if (data.success) {
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // verify otp and register
  const verifyOtpAndRegister = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Enter OTP!");
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
        otp,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        fetchUserData(data.token);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  // login handler
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        fetchUserData(data.token);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      className="flex flex-col justify-center min-h-[21rem] max-w-96 rounded-lg p-8 mx-auto mt-5 border border-black"
      onSubmit={state === "login" ? loginHandler : otpSent ? verifyOtpAndRegister : sendOtpHandler}
    >
      <h1 className="text-2xl text-center font-semibold">
        {state === "login" ? "Login" : otpSent ? "Verify OTP" : "Create Account"}
      </h1>
      <p className="mt-3">
        Please {state === "login" ? "log in" : "sign up"} to book appointment
      </p>

      {state === "sign up" && !otpSent && (
        <>
          <p className="mt-2">Full Name</p>
          <input
            className="border h-10 w-full border-gray-400 rounded-md"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </>
      )}

      {state === "login" || !otpSent ? (
        <>
          <p className="mt-2">Email</p>
          <input
            className="border h-10 w-full border-gray-400 rounded-md"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p className="mt-2">Password</p>
          <input
            className="border h-10 w-full border-gray-400 rounded-md"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      ) : null}

      {otpSent && (
        <>
          <p className="mt-2">Enter OTP</p>
          <input
            className="border h-10 w-full border-gray-400 rounded-md"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </>
      )}

      <button className="mt-5 py-2 rounded-md bg-blue-500 text-white">
        {state === "login"
          ? "Login"
          : otpSent
          ? "Verify & Create Account"
          : "Send OTP"}
      </button>

      <div className="flex mt-2">
        <p>{state === "login" ? "Create a new account?" : "Already have an account?"}</p>
        <button
          type="button"
          onClick={() => {
            setOtpSent(false);
            setState(state === "sign up" ? "login" : "sign up");
          }}
          className="text-blue-600 underline ml-1"
        >
          Click here
        </button>
      </div>

      {state === "login" && (
        <div className="flex flex-row gap-1 mt-1 italic">
          <Link
            to={"https://medi-quick-panel-pied.vercel.app"}
            className="text-blue-600 underline ml-1"
          >
            Click here
          </Link>
          <p className="font-medium">for doctor/admin login.</p>
        </div>
      )}
    </form>
  );
};

export default LogIn;

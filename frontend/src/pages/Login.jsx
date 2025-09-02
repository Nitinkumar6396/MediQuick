import { useContext, useState } from "react";
import axios from 'axios'
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const LogIn = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const { setToken, backendUrl, fetchUserData } = useContext(AppContext)

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === "sign up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) {
          fetchUserData(data.token)
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }
      else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (data.success) {
          fetchUserData(data.token)
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <form
      className="flex flex-col max-w-96 rounded-lg p-8 mx-auto mt-5 border border-black"
      onSubmit={submitHandler}
    >
      <h1 className="text-2xl text-center font-semibold">
        {state === "login" ? "Login" : "Create Account"}
      </h1>
      <p className="mt-3">
        Please {state === "login" ? "log in" : "sign up"} to book appointment
      </p>
      <div className={`${state === "login" ? "hidden" : ""}`}>
        <p className="mt-2">Full Name</p>
        <input
          className="border h-10 w-full border-gray-400 rounded-md"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <p className="mt-2">Email</p>
        <input
          className="border h-10 w-full border-gray-400 rounded-md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <p className="mt-2">Password</p>
        <input
          className="border h-10 w-full border-gray-400 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="mt-5 py-2 rounded-md bg-blue-500 text-white">
        {state === "login" ? "Login" : "Create account"}
      </button>
      <div className="flex mt-2">
        <p>{state === "login" ? "Create a new account?" : "Already have an account?"}</p>
        <button
          type="button"
          onClick={() => setState(state === "sign up" ? "login" : "sign up")}
          className="text-blue-600 underline ml-1"
        >
          Click here
        </button>
      </div>

      {
        state === "login" &&
        <div className="flex flex-row gap-1 mt-1 italic">
          <Link to={''} className="text-blue-600 underline ml-1">
            Click here
          </Link>
          <p className="font-medium">for doctor/admin login.</p>
        </div>
      }
    </form>
  );
};

export default LogIn;

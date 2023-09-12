/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { GetServerUrl } from "../../../hooks";
import { toast } from 'react-toastify';
import { AppContext } from "../../../App";
import axios from "axios";

const serverUrl = GetServerUrl();

const SignIn = ({ setSignType }) => {
  const [user, setUser] = useState({});
  const { setCookies } = useContext(AppContext);

  const handleChange = async (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const promise = await axios.post(`${serverUrl}/authentication/signIn`, {
        email: user.email,
        password: user.password
      });

      const { message, token, mainUserId } = promise.data;

      if (message) {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        localStorage.setItem("mainUserId", mainUserId);
        setCookies("access_token", token);
      }
    } catch (error) {
      console.log(error);
    }

    Array.from(e.target.elements).map(element => element.value = "");
  }

  return (
    <div className="flex flex-col w-full max-w-md">
      <h2 className="text-2xl font-bold text-center">Sign In Your Account</h2>

      <div className="mt-8 px-6 py-12 rounded-lg shadow-md bg-white">
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="email" className="text-sm">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              onChange={handleChange}
              className="mt-2 w-full rounded-md border-0 py-1.5 px-3 
                shadow-sm ring-1 ring-inset ring-gray-300 
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              className="mt-2 w-full rounded-md border-0 py-1.5 px-3
              text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
              focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 
              py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
              hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
              focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign In
          </button>
        </form>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        <span className="mr-1">
          Do you have no account?
        </span>
        <button
          onClick={() => setSignType("SignUp")}
          className="font-semibold leading-6 text-indigo-600 
          hover:text-indigo-500"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default SignIn

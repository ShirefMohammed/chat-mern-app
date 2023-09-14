import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Authentication, Chat } from "./pages";
import { CheckPageVisibility, GetServerUrl } from "./hooks";
import "./App.css";
import axios from "axios";

export const AppContext = createContext();
const serverUrl = GetServerUrl();

function App() {
  const [cookies, setCookies] = useCookies();
  const [mainUserId, setMainUserId] = useState("");
  const [mainUser, setMainUser] = useState({});

  useEffect(() => {
    if (cookies.access_token) {
      setMainUserId(localStorage.getItem("mainUserId"));
    } else {
      setMainUserId("");
    }
  }, [cookies]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (mainUserId) {
          const promise =
            await axios.get(`${serverUrl}/users/getUser/userId/${mainUserId}`);
          setMainUser(promise.data.user);
        } else {
          setMainUser({});
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [mainUserId]);

  return (
    <AppContext.Provider value={{
      cookies,
      setCookies,
      mainUserId,
      setMainUserId,
      mainUser,
      setMainUser
    }}>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route
              path='/'
              element={<Authentication />}
            />

            <Route
              path='https://chat-mern-app.vercel.app/'
              element={<Authentication />}
            />

            <Route
              path="/chat"
              element={<Chat />}
            />

            <Route
              path="https://chat-mern-app.vercel.app/chat"
              element={<Chat />}
            />
          </Routes>
        </div>

        {/* check if user has no account then navigate / to Home */}
        <CheckPageVisibility />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App

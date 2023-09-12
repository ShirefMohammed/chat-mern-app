import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";

const Authentication = () => {
  const [signType, setSignType] = useState("SignIn");
  const { cookies } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    cookies.access_token && navigate("/chat");
  }, [cookies, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 
      py-12 bg-slate-50"
    >
      {
        signType === "SignIn" ?
          <SignIn setSignType={setSignType} />

          : signType === "SignUp" ?
            <SignUp setSignType={setSignType} />

            : ""
      }
    </div>
  )
}

export default Authentication

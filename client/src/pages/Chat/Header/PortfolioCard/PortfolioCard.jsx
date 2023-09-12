/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AppContext } from "../../../../App";
import { ConvertToBase64, GetServerUrl } from "../../../../hooks";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";

const serverUrl = GetServerUrl();

const PortfolioCard = ({ setOpenPortfolio }) => {
  const { cookies, mainUser, setMainUser } = useContext(AppContext);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    email: "",
    picture: ""
  });

  const handleChange = async (e) => {
    setNewData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleImageFile = async (e) => {
    const picture = await ConvertToBase64(e.target.files[0]);
    setNewData(prev => ({ ...prev, "picture": picture }));
  }

  const updatePortfolio = async (e) => {
    e.preventDefault();

    try {
      if (newData.name == "" && newData.email == "" && newData.picture == "") {
        toast.info("must enter at least one field", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      setUpdateLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        }
      };

      const promise = await axios.post(`${serverUrl}/users/updatePortfolio`, {
        name: newData.name,
        email: newData.email,
        picture: newData.picture
      }, config);

      const { updated, message, user } = promise.data;

      if (updated) {
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setMainUser(user);
      } else {
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
      }

      setUpdateLoading(false);
    } catch (error) {
      console.log(error);
    }

    setNewData({
      name: "",
      email: "",
      picture: ""
    });
  }

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 
      z-50 w-full max-w-xs rounded-md shadow-md py-12 px-4 bg-white flex
      flex-col items-center"
    >
      <span
        onClick={() => setOpenPortfolio(false)}
        className="absolute top-3 right-3 text-2xl cursor-pointer
          hover:text-red-500"
      >
        x
      </span>

      <img
        src={mainUser.picture}
        alt="mainUser picture"
        className="w-24 h-24 rounded-full object-cover"
      />

      <span className="mt-5">{mainUser.name}</span>

      <span>{mainUser.email}</span>

      {
        !openUpdateForm ?
          <button
            onClick={() => setOpenUpdateForm(true)}
            className="py-1 px-5 mt-5 bg-slate-100 rounded-md"
          >
            update
          </button>

          : <form
            onSubmit={updatePortfolio}
            className="mt-5 flex flex-col gap-3"
          >
            <input
              type="text"
              name="name"
              placeholder="name"
              value={newData.name}
              onChange={handleChange}
              className="block flex-1 rounded-md border-0 p-1.5 w-full
                  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-3 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                  focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />

            <input
              type="email"
              name="email"
              placeholder="email"
              value={newData.email}
              onChange={handleChange}
              className="block flex-1 rounded-md border-0 p-1.5 w-full
                  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-3 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                  focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />

            <input
              type="file"
              onChange={handleImageFile}
              className="block flex-1 rounded-md border-0 p-1.5 w-full
                  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-3 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                  focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />

            <button
              type="submit"
              className="flex gap-3 justify-center items-center rounded-md
                  p-1.5 text-white bg-indigo-400 hover:bg-indigo-600"
            >
              save changes
              {
                updateLoading &&
                <RotatingLines
                  strokeColor="#00f"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
              }
            </button>
          </form>
      }
    </div>
  )
}

export default PortfolioCard

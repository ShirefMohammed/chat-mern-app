/* eslint-disable react/prop-types */
import { Fragment, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, Transition } from '@headlessui/react';
import { AppContext } from "../../../../App";
import PortfolioCard from "../PortfolioCard/PortfolioCard"

const Account = () => {
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const { setCookies, mainUser } = useContext(AppContext);
  const navigate = useNavigate();

  const logoOut = () => {
    setCookies("access_token", "");
    localStorage.removeItem("mainUserId");
    localStorage.removeItem("currentChatId");
    navigate("/");
  }

  return (
    <Popover.Group className="flex">
      <Popover className="relative">
        {/* Popover Button */}
        <Popover.Button className="flex items-center gap-x-1 text-sm
          font-semibold leading-6 text-gray-900">
          <img
            src={mainUser.picture}
            alt="mainUser picture "
            className="w-8 h-8 rounded-full object-cover"
          />
        </Popover.Button>

        {/* Popover Panel Transition */}
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          {/* Popover Panel */}
          <Popover.Panel className="absolute right-0 top-full z-10 mt-3
            p-1 w-60 overflow-hidden rounded-md bg-white shadow-lg ring-1 
          ring-gray-900/5"
          >
            {/* Link /userPortfolio */}
            <button
              onClick={() => setOpenPortfolio(true)}
              className="group relative flex items-center gap-x-6 cursor-pointer
                rounded-md p-1 text-sm leading-6 hover:bg-slate-100 w-full"
            >
              <div className="flex h-8 w-8 flex-none items-center
                justify-center rounded-md bg-slate-100"
              >
                <i className="fa-solid fa-user text-sm"></i>
              </div>
              <span>Your Portfolio</span>
            </button>

            {/* Link logoOut() / */}
            <button
              type="button"
              onClick={logoOut}
              className="group relative flex items-center gap-x-6 cursor-pointer
                rounded-md p-1 text-sm leading-6 hover:bg-slate-100 w-full"
            >
              <div className="flex h-8 w-8 flex-none items-center 
                justify-center rounded-md bg-slate-100 roup-hover:bg-white"
              >
                <i className="fa-solid fa-right-from-bracket text-sm"></i>
              </div>
              <span>Log Out</span>
            </button>
          </Popover.Panel>
        </Transition>
      </Popover>

      {
        openPortfolio &&
        <PortfolioCard setOpenPortfolio={setOpenPortfolio} />
      }
    </Popover.Group>
  )
}

export default Account

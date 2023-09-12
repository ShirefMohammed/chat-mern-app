import { Fragment, useState, useContext } from "react";
import { Popover, Transition } from '@headlessui/react';
import { RotatingLines } from "react-loader-spinner";
import { GetServerUrl } from "../../../../hooks";
import { AppContext } from "../../../../App";
import { ChatContext } from "../../Chat";
import axios from "axios";

const serverUrl = GetServerUrl();

const Search = () => {
  const { cookies } = useContext(AppContext);
  const { myChats, setMyChats, setCurrentChat } = useContext(ChatContext);
  const [searchKey, setSearchKey] = useState();
  const [searchResults, setSearchResults] = useState();
  const [searchLoading, setSearchLoading] = useState(false);

  const searchUsers = async (e) => {
    e.preventDefault();
    try {
      setSearchLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      };
      const promise = await axios.get(`${serverUrl}/users/getUsers?search=${searchKey}`, config);
      setSearchResults(promise.data.users);
      setSearchLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const accessChats = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      };
      const promise = await axios.post(`${serverUrl}/chats/accessChats`, {
        userId: userId
      }, config);
      const { chat } = promise.data;
      setCurrentChat(chat);
      if (!myChats.some(myChat => myChat._id === chat._id)) {
        setMyChats(prev => [chat, ...prev]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Popover.Group className="flex">
      <Popover className="relative">
        {/* Popover Button */}
        <Popover.Button className="flex items-center justify-center
          rounded-full w-8  h-8 text-sm bg-slate-100 text-black"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
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
          <Popover.Panel className="absolute -right-14 sm:right-0 top-full 
            z-10 mt-3 p-4 w-72 overflow-hidden rounded-md bg-white 
            shadow-lg ring-1 ring-gray-900/5 flex flex-col gap-2"
          >
            {/* Search Form */}
            <form
              className="flex items-center gap-x-3"
              onSubmit={searchUsers}
            >
              <input
                type="text"
                name="searchKey"
                placeholder="search user"
                required
                className="block flex-1 rounded-md border-0 p-1.5 w-full
                  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-3 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                  focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={e => setSearchKey(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-full w-8
                  h-8 text-sm text-white bg-indigo-600
                hover:bg-indigo-500"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>

            {/* Search Result */}
            {
              searchLoading ?
                <div className="mx-auto py-3 ">
                  <RotatingLines
                    strokeColor="#00f"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible={true}
                  />
                </div>

                : searchResults?.length > 0 ?
                  searchResults.map(user =>
                    <button
                      key={user._id}
                      className="group relative flex items-center gap-x-4
                        text-start rounded-md py-1 px-2 text-sm leading-6
                      bg-slate-100"
                      onClick={() => accessChats(user._id)}
                    >
                      <img
                        src={user.picture}
                        alt="user picture"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="block -mb-2 font-semibold">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-600">
                          {user.email}
                        </span>
                      </div>
                    </button>)

                  : searchResults?.length == 0 ?
                    <p className="hover:bg-gray-50 text-center rounded-md 
                      p-1 text-sm font-semibold">
                      no search results
                    </p>

                    : ""
            }
          </Popover.Panel>
        </Transition>
      </Popover>
    </Popover.Group>
  )
}

export default Search

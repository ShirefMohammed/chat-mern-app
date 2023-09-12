/* eslint-disable react/prop-types */
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { ChatContext } from "../Chat";
import ChatCard from "./ChatCard/ChatCard";

const ChatList = () => {
  const { hiddenInSm, myChats } = useContext(ChatContext);

  return (
    <section className={
      `${hiddenInSm == "ChatList" ? "hidden" : ""}
      w-full md:w-80 md:block bg-white rounded-md shadow-lg
      p-4`
    }
    >
      <h2 className="font-semibold text-xl">
        My Chats
      </h2>

      <hr className="w-11/12 my-4 h-px bg-slate-200 mx-auto" />

      {
        myChats.length > 0 ?
          <div className="mt-5 flex flex-col gap-y-2">
            {
              myChats.map(chat =>
                chat?._id && <ChatCard key={chat._id} chat={chat} />
              )
            }
          </div>

          : myChats?.length == 0 ?
            <p className="mt-10 font-bold text-center">
              You have no chats
            </p>

            : <div className="w-full h-full flex items-center 
              justify-center flex-1"
            >
              <RotatingLines
                strokeColor="#00f"
                strokeWidth="5"
                animationDuration="0.75"
                width="20"
                visible={true}
              />
            </div>
      }
    </section>
  )
}

export default ChatList
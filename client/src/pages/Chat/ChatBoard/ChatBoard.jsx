import { useContext } from "react";
import { ChatContext } from "../Chat";
import Header from "./Header/Header";
import Messages from "./Messages/Messages";

const ChatBoard = () => {
  const { hiddenInSm, currentChat } = useContext(ChatContext);

  return (
    <section className={
      ` ${hiddenInSm == "ChatBoard" ? "hidden" : ""}
      flex-1 bg-white md:block rounded-md shadow-lg p-4`
    }
    >
      {
        currentChat?._id ?
          <div className="h-full flex flex-col justify-between">
            <Header />
            <Messages />
          </div>

          : <div
            className="w-full h-full flex items-center 
            justify-center font-semibold text-center"
          >
            Access any chat to start chatting now
          </div>
      }
    </section>
  )
}


export default ChatBoard

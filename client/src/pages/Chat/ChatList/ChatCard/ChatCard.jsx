/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../../App";
import { ChatContext } from "../../Chat";
import groupChatImageAlt from "../../../../assets/groupChatImageAlt.png"

const ChatCard = ({ chat }) => {
  const { mainUserId } = useContext(AppContext);
  const [anotherUser, setAnotherUser] = useState();
  const {
    setHiddenInSm,
    currentChat,
    setCurrentChat,
    onlineUsers
  } = useContext(ChatContext);

  useEffect(() => {
    if (!chat.isGroupChat) {
      setAnotherUser(() => chat.users.find(user => user._id != mainUserId));
    }
  }, [chat, mainUserId]);

  const openChat = () => {
    setCurrentChat(chat);
    setHiddenInSm("ChatList");
  }

  const checkOnlineStatus = () => {
    return onlineUsers.some(user => user.userId == anotherUser?._id);
  };

  return (
    <button
      onClick={openChat}
      className="py-2 px-2 rounded-md bg-slate-100
        flex items-center gap-x-4"
    >
      {
        chat?.isGroupChat ?
          <img
            src={groupChatImageAlt}
            alt="group chat picture"
            className="w-8 h-8 rounded-full object-cover shadow-md"
          />

          : <div className="relative">
            <img
              src={anotherUser?.picture}
              alt="another user picture"
              className="w-8 h-8 rounded-full object-cover"
            />

            {
              checkOnlineStatus() ?
                <span className="w-2 h-2 rounded-full bg-green-500 absolute
                  top-1 left-0"></span>
                : <span className="w-2 h-2 rounded-full bg-gray-400 absolute
                  top-1 left-0"></span>
            }
          </div>
      }

      <div className="text-start">
        {
          chat?.isGroupChat ?
            <div className="block">
              {chat.groupName}
            </div>

            : <div className="block">
              {anotherUser?.name}
            </div>
        }

        {
          currentChat?._id != chat._id ?
            <div className="block text-xs">
              {
                chat?.latestMessage?.sender._id ?
                  chat.latestMessage.sender._id !== mainUserId ?
                    <span>{chat.latestMessage.sender.name}: </span>
                    : <span>you: </span>
                  : ""
              }
              {
                <span>
                  {
                    chat?.latestMessage?.content.length < 20 ?
                      chat?.latestMessage?.content
                      : chat?.latestMessage?.content.substring(0, 20) &&
                      chat?.latestMessage?.content.substring(0, 20) + "..."
                  }
                </span>
              }
            </div>
            : ""
        }
      </div>
    </button>
  )
}


export default ChatCard

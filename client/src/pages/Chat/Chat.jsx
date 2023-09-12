import { useState, useEffect, useRef, createContext, useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { GetServerUrl } from "../../hooks";
import { AppContext } from "../../App";
import { io } from "socket.io-client";
import Header from "./Header/Header";
import ChatList from "./ChatList/ChatList";
import ChatBoard from "./ChatBoard/ChatBoard";
import axios from "axios";

export const ChatContext = createContext();
const serverUrl = GetServerUrl();

const Chat = () => {
  const { cookies, mainUserId, mainUser } = useContext(AppContext);
  const [hiddenInSm, setHiddenInSm] = useState("ChatBoard");
  const [myChats, setMyChats] = useState();
  const [currentChat, setCurrentChat] = useState({});
  const [chatMessages, setChatMessages] = useState();
  const [chatMessagesLoading, setChatMessagesLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState();
  const socket = useRef();

  // setup socket io
  useEffect(() => {
    if (!mainUserId) return;
    socket.current = io(serverUrl);
    socket.current.emit("UserLogIn", mainUserId);
    socket.current.on("getOnlineUsers", (onlineUsers) =>
      setOnlineUsers(onlineUsers));
  }, [mainUserId]);

  // receive realtime message 
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("receiveMessage", data => {
      const { message, chatMessagesLength } = data;

      const currentChatId = localStorage.getItem("currentChatId");

      if (currentChatId === message.chat._id) {
        if (chatMessagesLength - chatMessages?.length == 1) {
          setChatMessages(prev => [...prev, message]);
        }
      } else {
        console.log("notification");
      }
    });
  }, [chatMessages, mainUserId]);

  // fetch my chats
  useEffect(() => {
    const fetchMyChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        };
        const promise = await axios.get(`${serverUrl}/chats/fetchMyChats`,
          config);
        setMyChats(promise.data.chats);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMyChats();
  }, [cookies.access_token]);

  // fetch chat messages
  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        if (!currentChat?._id) return;
        setChatMessagesLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        };
        const promise = await axios.get(`${serverUrl}/messages/getChatMessages/${currentChat._id}`, config);
        setChatMessages(promise.data.chatMessages);
        setChatMessagesLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchChatMessages();
  }, [cookies, currentChat]);

  // set current chat id in local storage
  useEffect(() => {
    localStorage.setItem("currentChatId", currentChat?._id);
  }, [currentChat]);

  return (
    <ChatContext.Provider value={{
      hiddenInSm,
      setHiddenInSm,
      myChats,
      setMyChats,
      currentChat,
      setCurrentChat,
      onlineUsers,
      chatMessages,
      setChatMessages,
      chatMessagesLoading,
      setChatMessagesLoading,
      socket
    }}
    >
      {
        mainUser?._id && myChats?.length ?
          <div className="chat_page">
            <Header />
            <div
              className="w-full bg-slate-50"
              style={{ height: "calc(100vh - 72px)" }}
            >
              <div className="p-4 flex gap-x-4 max-w-7xl mx-auto h-full">
                <ChatList />
                <ChatBoard />
              </div>
            </div>
          </div>

          : <div className="w-full h-screen flex items-center justify-center">
            <RotatingLines
              strokeColor="#00f"
              strokeWidth="5"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
      }
    </ChatContext.Provider>
  )
}

export default Chat

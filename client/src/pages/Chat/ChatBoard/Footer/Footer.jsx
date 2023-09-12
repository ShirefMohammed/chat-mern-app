/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { GetServerUrl } from "../../../../hooks";
import { RotatingLines } from "react-loader-spinner";
import { AppContext } from "../../../../App";
import { ChatContext } from "../../Chat";
import TextareaAutosize from "react-textarea-autosize";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import axios from "axios";

const serverUrl = GetServerUrl();

const Footer = ({ chatMessages, setChatMessages }) => {
  const { cookies } = useContext(AppContext);
  const { currentChat, socket } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [clickOutPickerEvent, setClickOutPickerEvent] = useState(false);

  useEffect(() => {
    openEmojiPicker == true ?
      setClickOutPickerEvent(true)
      : setClickOutPickerEvent(false);
  }, [openEmojiPicker])

  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      setSendMessageLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      };

      const promise = await axios.post(`${serverUrl}/messages/sendMessage`, {
        chatId: currentChat._id,
        content: newMessage
      }, config);

      const { message } = promise.data;

      setChatMessages(prev => [...prev, message]);

      setSendMessageLoading(false);

      socket.current.emit("sendMessage", {
        message: message,
        chatMessagesLength: chatMessages.length + 1
      });
    } catch (error) {
      console.log(error);
    }

    setNewMessage("");
  }

  return (
    <footer className="flex items-center gap-x-3">
      <form
        className="flex-1 flex items-center gap-x-3"
        onSubmit={sendMessage}>
        <TextareaAutosize
          value={newMessage}
          placeholder="send new message"
          onChange={(e) => setNewMessage(e.target.value)}
          minRows={2}
          maxRows={10}
          required
          className="resize-none flex-1 rounded-md border-0 p-1.5 w-full
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-3 
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
            focus:ring-indigo-600 sm:text-sm leading-3"
        />

        {
          sendMessageLoading ?
            <RotatingLines
              strokeColor="#4f46e5"
              strokeWidth="5"
              animationDuration="0.75"
              width="32"
              visible={true}
            />
            : <button
              type="submit"
              className="flex items-center justify-center rounded-full w-8
              h-8 text-sm text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
        }
      </form>

      <div className="relative">
        <button onClick={() => setOpenEmojiPicker(prev => !prev)}>
          <i className="fa-regular fa-face-smile text-3xl text-slate-600"></i>
        </button>
        {
          openEmojiPicker &&
          <div className="absolute right-0 bottom-12">
            <Picker
              data={data}
              theme={"dark"}
              onEmojiSelect={(e) => setNewMessage(prev => prev + e.native)}
              onClickOutside={() =>
                clickOutPickerEvent == true && setOpenEmojiPicker(false)
              }
            />
          </div>
        }
      </div>
    </footer>
  )
}

export default Footer

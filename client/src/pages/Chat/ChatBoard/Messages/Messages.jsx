import { useEffect, useRef, useContext, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { AppContext } from "../../../../App";
import { ChatContext } from "../../Chat";
import chatBackGround from "../../../../assets/chatBackGround.png"

import Footer from "../Footer/Footer";
import ProfileCard from "../ProfileCard/ProfileCard";

const Messages = () => {
  const [openProfileCard, setOpenProfileCard] = useState(false);
  const { mainUserId } = useContext(AppContext);
  const {
    chatMessages,
    chatMessagesLoading,
    setChatMessages
  } = useContext(ChatContext);
  const scrollRef = useRef();

  // check if the same sender of messages to display its photo
  const isSameSender = (chatMessages, index, mainUserId) => {
    if (index < chatMessages.length - 1 &&
      (chatMessages[index + 1].sender._id !== chatMessages[index].sender._id
        || chatMessages[index + 1].sender._id === undefined)
      && chatMessages[index].sender._id !== mainUserId) {
      return true
    }

    if (index === chatMessages.length - 1 &&
      chatMessages[chatMessages.length - 1].sender._id !== mainUserId &&
      chatMessages[chatMessages.length - 1].sender._id) {
      return true;
    }

    return false;
  };

  // check if messages in the same day to display date
  const isSameDay = (chatMessages, index) => {
    if (index === 0) { return true; }

    if (
      chatMessages[index].createdAt.substring(0, 10)
      !== chatMessages[index - 1].createdAt.substring(0, 10)
    ) {
      return true
    }

    return false;
  };

  // scroll to the last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <>
      <div
        style={{ backgroundImage: `url(${chatBackGround})` }}
        className="h-full flex-1 p-4 rounded-md overflow-y-auto"
      >
        {
          chatMessagesLoading ?
            <div className="w-full h-full flex items-center justify-center">
              <RotatingLines
                strokeColor="#4f46e5"
                strokeWidth="5"
                animationDuration="0.75"
                width="25"
                visible={true}
              />
            </div>

            : chatMessages?.length > 0 ?
              <ul className=" flex flex-col gap-y-3">
                {
                  chatMessages.map((message, index) =>
                    message?._id &&
                    <li
                      key={message._id}
                      ref={scrollRef}
                    >
                      {/* Is Message In Same Day */}
                      {
                        isSameDay(chatMessages, index) &&
                        <div>
                          {
                            index !== 0 &&
                            <hr className="w-4/5 h-px mx-auto my-6 bg-slate-300"
                            ></hr>
                          }
                          <div className="mb-6 text-center">
                            {`${new Date(message.createdAt).getDate()} 
                            ${new Date(message.createdAt).toLocaleString('default', { month: 'long' })} 
                            ${new Date(message.createdAt).getFullYear()}`}
                          </div>
                        </div>
                      }

                      {/* Sender Picture and Message  */}
                      <div
                        className={
                          message.sender._id === mainUserId ?
                            "flex gap-2 justify-end"
                            : "flex gap-2 justify-start"
                        }
                      >
                        {/* Sender Picture */}
                        {
                          isSameSender(chatMessages, index, mainUserId) ?
                            <button
                              onClick={() => setOpenProfileCard(true)}
                              className="cursor-pointer"
                            >
                              <img
                                src={message.sender.picture}
                                alt="message sender picture"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </button>
                            : <span className="mr-8"></span>
                        }

                        {/* Message */}
                        <div
                          className={
                            `${message.sender._id === mainUserId ?
                              "bg-green-100"
                              : "bg-indigo-100"}
                            p-2 rounded-md relative`
                          }
                        >
                          {/* Message Content */}
                          <pre style={{ width: "100%", fontFamily: "inherit"}}
                          >
                            <div className="leading-5 sm-max-w-220
                              sm:max-w-xs lg:max-w-lg whitespace-break-spaces"
                            >
                              {message.content}
                            </div>

                            {/* Message Date */}
                            <span className="block text-xs text-slate-600">
                              {
                                new Date(message.createdAt)
                                  .toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })
                              }
                            </span>
                          </pre>

                          {/* Small Arrow */}
                          <span
                            style={
                              message.sender._id === mainUserId ?
                                {
                                  position: "absolute",
                                  top: "0",
                                  right: "-5px",
                                  border: "5px solid",
                                  borderColor: "#dcfce7 transparent transparent #dcfce7"
                                }
                                :
                                {
                                  position: "absolute",
                                  top: "0",
                                  left: "-5px",
                                  border: "5px solid",
                                  borderColor: "#e0e7ff #e0e7ff transparent transparent"
                                }
                            }
                          >
                          </span>
                        </div>
                      </div>

                      {
                        openProfileCard &&
                        <ProfileCard
                          anotherUser={message.sender}
                          setOpenProfileCard={setOpenProfileCard}
                        />
                      }
                    </li>)
                }
              </ul>

              : chatMessages?.length == 0 ?
                <p className="h-full flex items-center justify-center
                  font-semibold"
                >
                  No Messages Created
                </p>

                : ""
        }
      </div>

      <hr className="w-11/12 my-3 h-px bg-slate-200 mx-auto" />

      <Footer
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
      />
    </>
  )
}

export default Messages

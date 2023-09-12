import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../../App";
import { ChatContext } from "../../Chat";
import ProfileCard from "../ProfileCard/ProfileCard";

const Header = () => {
  const [anotherUser, setAnotherUser] = useState();
  const [openProfileCard, setOpenProfileCard] = useState(false);
  const { mainUserId } = useContext(AppContext);
  const { setHiddenInSm, currentChat } = useContext(ChatContext);

  useEffect(() => {
    if (!currentChat?.isGroupChat) {
      setAnotherUser(() => currentChat.users.find(user =>
        user._id != mainUserId));
    }
    setOpenProfileCard(false);
  }, [currentChat, mainUserId]);

  return (
    <header>
      <div className="flex items-center justify-between">
        {
          !currentChat?.isGroupChat ?
            <button
              onClick={() => setOpenProfileCard(true)}
              className="relative flex items-center gap-4 cursor-pointer"
            >
              <img
                src={anotherUser?.picture}
                alt="anotherUser picture"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>
                {anotherUser?.name}
              </span>
            </button>

            : <span>
              {currentChat.groupName}
            </span>
        }

        <div className="flex items-center gap-x-1">
          <button
            className="w-8 h-8 rounded-full flex items-center
              justify-center hover:bg-slate-100 md:hidden"
            onClick={() => setHiddenInSm("ChatBoard")}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
      </div>

      <hr className="w-11/12 my-3 h-px bg-slate-200 mx-auto" />

      {
        openProfileCard &&
        <ProfileCard
          anotherUser={anotherUser}
          setOpenProfileCard={setOpenProfileCard}
        />
      }
    </header>
  )
}

export default Header

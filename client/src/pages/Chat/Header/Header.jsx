import { Link } from "react-router-dom";
import chatLogo from "../../../assets/chatLogo.png";

import Notifications from "./Notifications/Notifications";
import Search from "./Search/Search";
import Account from "./Account/Account";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl flex justify-between p-3">
        {/* Chat Logo - left side */}
        <Link to="/chat">
          <img
            src={chatLogo}
            alt="chatLogo"
            className="w-24 h-12 object-cover"
          />
        </Link>

        {/* Search - Account - right side */}
        <div className="flex items-center gap-x-6">
          <Notifications />
          <Search />
          <Account />
        </div>
      </div>
    </header>
  )
}

export default Header
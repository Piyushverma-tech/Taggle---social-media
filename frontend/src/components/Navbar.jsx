import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaCommentDots, FaFilm } from "react-icons/fa";

const Navbar = ({ user }) => {
  const [active, setActive] = useState("Home"); 
  const navItems = [
    { id: "Home", icon: <FaHome />, label: "Home", path: "/" },
    { id: "Chat", icon: <FaCommentDots />, label: "Chat", path: "/chat" },
    { id: "Search", icon: <FaSearch />, label: "Search", path: "/search" },
    { id: "Reel", icon: <FaFilm />, label: "Reels", path: "/reel" },
  ];

  return (
    <div
      className="
        fixed
        md:left-5 md:top-0 md:h-screen md:w-20
        md:bg-transparent md:shadow-none
        w-full md:bottom-auto bottom-0
        bg-gray-100
        text-gray-500 shadow-lg z-50
        md:flex flex-col justify-center items-center space-y-6
        "
    >
      {/* Navigation container */}
      <div className="md:flex md:flex-col md:justify-center md:space-y-6 w-full h-full py-2 flex flex-row justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`group flex md:flex-col items-center text-sm transition-all ${
              active === item.id ? "text-teal-400" : "hover:text-gray-200"
            }`}
            onClick={() => setActive(item.id)}
          >
            {/* Icon */}
            <div
              className={`text-2xl md:text-3xl p-2 rounded-full ${
                active === item.id
                  ? "bg-indigo-500 text-gray-200"
                  : "group-hover:bg-gray-700 group-hover:text-white"
              }`}
            >
              {item.icon}
            </div>
          </Link>
        ))}
        {/* Profile */}
        <Link
          to="/account"
          className={`group flex md:flex-col items-center text-sm transition-all ${
            active === "account" ? "text-teal-400" : "hover:text-gray-200"
          }`}
          onClick={() => setActive("account")}
        >
          {/* Profile Picture */}
          <div
            className={`text-2xl md:text-3xl p-1 rounded-full ${
              active === "account"
                ? "bg-indigo-500 text-gray-200"
                : "group-hover:bg-gray-700 group-hover:text-white"
            }`}
          >
            {user && user.profilePic ? (
              <img
                src={user.profilePic.url}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover"
              />
            ) : (
              <FaUserCircle />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

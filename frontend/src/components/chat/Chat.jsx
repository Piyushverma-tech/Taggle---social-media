import React from "react";
import { UserData } from "../../context/userContext";
import { BsSendCheck } from "react-icons/bs";

const Chat = ({ chat, setSelectedChat, isOnline }) => {
  const { user: loggedInUser } = UserData();
  let user;
  if (chat) user = chat.users[0];

  return (
    <div>
      {user && (
        <div
          className="flex items-center p-4 bg-transparent bg-opacity-50 rounded-md cursor-pointer hover:bg-gray-100  "
          onClick={() => setSelectedChat(chat)}
        >
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user.profilePic.url}
              alt={user.name}
              className="w-10 h-10 ml-2 rounded-full object-cover"
            />
            {/* Online Status Indicator */}
           { isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>}
          </div>

          {/* Chat Details */}
          <div className="flex-1">
            {/* User Name */}
            <div className="text-gray-800 font-semibold ml-6">{user.name}</div>
            {/* Latest Message */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="ml-6 mr-auto">{chat.latestMessage.text.slice(0, 18)}...</span>
              {user._id !== chat.latestMessage.sender && (
                <BsSendCheck className="text-end text-teal-500" />
              )} 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

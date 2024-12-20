import React, { useEffect, useState } from "react";
import { ChatData } from "../context/chatContext";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { IoAddCircleSharp } from "react-icons/io5";
import Chat from "../components/chat/Chat";
import MessageContainer from "../components/chat/MessageContainer";
import { SocketData } from "../context/socketContext";

const ChatPage = ({ }) => {
  const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);



  // Fetch users when search is triggered
  useEffect(() => {
    if (search && query.trim()) {
      const delayDebounce = setTimeout(() => {
        fetchAllUsers();
      }, 300); // Debounce to reduce API calls
      return () => clearTimeout(delayDebounce);
    } else {
      setUsers([]);
    }
  }, [query]);

  // Fetch all users based on query
  const fetchAllUsers = async () => {
    setLoadingSearch(true);
    try {
      const { data } = await axios.get(`/api/user/all?search=${query}`);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Fetch all chats
  const getAllChats = async () => {
    setLoadingChats(true);
    try {
      const { data } = await axios.get("/api/messages/chats");
      setChats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChats(false);
    }
  };

    // Fetch all chats on component mount
    useEffect(() => {
      getAllChats();
    }, []);

  // Create a new chat
  const createNewChat = async (id) => {
    await createChat(id);
    setSearch(false);
    setQuery("");
    getAllChats();
  };

  const { onlineUsers, socket } = SocketData();

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-200">
      {/* Chat List Section */}
      {!selectedChat && (
        <div className="ml-auto mr-auto w-full min-h-screen max-w-md bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg  relative">
              <h1 className="text-center pt-4">Say hi to your friend</h1>
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearch(!search);
                  setQuery("");
                }}
                className="text-gray-600  hover:text-indigo-500"
              >
                {search ? (
                  <FaArrowLeft className="text-lg" />
                ) : (
                  <IoAddCircleSharp className="text-6xl md:text-5xl text-indigo-600 absolute bottom-20 right-4 md:bottom-6 md:right-4" />
                )}
              </button>
              {search && (
                <input
                  type="text"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Search username"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              )}
            </div>
          </div>
  
          {/* Chat List or Search Results */}
          <div className="p-4 ">
            {search ? (
              <div>
                {loadingSearch ? (
                  <p className="text-gray-500">Searching...</p>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-4 bg-transparent hover:bg-gray-100 rounded-md cursor-pointer transition duration-300"
                      onClick={() => createNewChat(user._id)}
                    >
                      <img src={user.profilePic.url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-gray-700 ml-4">{user.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No users found.</p>
                )}
              </div>
            ) : loadingChats ? (
              <p className="text-gray-500">Loading chats...</p>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <Chat key={chat._id} chat={chat} setSelectedChat={setSelectedChat} isOnline={onlineUsers.includes(chat.users[0]._id)} />
              ))
            ) : (
              <p className="text-gray-500">No chats available. Start a new one!</p>
            )}
          </div>
        </div>
      )}
  
      {/* Message Container Section */}
      {selectedChat && (
        <div>
          <MessageContainer
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            setChats={setChats}
            getAllChats={getAllChats}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
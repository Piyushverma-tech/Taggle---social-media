import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { UserData } from "../../context/userContext";
import axios from "axios";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { SocketData } from "../../context/socketContext";

const MessageContainer = ({ selectedChat, setSelectedChat, setChats, getAllChats,}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = UserData();
  const { onlineUsers, socket } = SocketData();
  
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (selectedChat._id === message.chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
  
      // Use functional updater to ensure the latest state
      setChats((prev) =>
        prev.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              latestMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return chat;
        })
      );
    };
  
    socket.on("newMessage", handleNewMessage);
    
  
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedChat]); 

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/messages/${selectedChat.users[0]._id}`);
        setMessages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

 const messageContainerRef = useRef(null);

 useEffect(() => {
  if (messageContainerRef.current){
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight}
 },[messages]);


 const handleBackToChats = () => {
  setSelectedChat(null);
  getAllChats();
  
 };

 return (
  <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center">
    <div className="w-full sm:max-w-md min-h-screen rounded-xl shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 bg-gray-100 p-4 border-b">
        <button
          className="text-gray-600 text-2xl font-extralight hover:text-indigo-500 p-2"
          onClick={handleBackToChats}
        >
          <FiArrowLeft />
        </button>
        <img
          src={selectedChat.users[0].profilePic.url}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold text-gray-800">
          {selectedChat.users[0].name}
        </span>
        {onlineUsers.includes(selectedChat.users[0]._id) && (
          <p className="text-sm text-green-400">Online</p>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-r from-blue-100 to-purple-200"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <Message
              key={msg._id}
              message={msg.text}
              ownMessage={msg.sender === user._id}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No messages yet. Start the conversation!
          </p>
        )}
        {/* Adds space for input */}
        <div className="h-20"></div>
      </div>

      {/* Input */}
      <div className="bg-gray-100 p-3 border-t fixed bottom-0 w-full sm:max-w-md">
        <MessageInput setMessages={setMessages} selectedChat={selectedChat} />
      </div>
    </div>
  </div>
);
};

export default MessageContainer;
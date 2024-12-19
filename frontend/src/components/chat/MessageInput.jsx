import React, { useState } from "react";
import { ChatData } from "../../context/chatContext";
import toast from "react-hot-toast";
import axios from "axios";
import { IoSend } from "react-icons/io5";

const MessageInput = ({ setMessages, selectedChat }) => {
  const [textMsg, setTextMsg] = useState("");
  const { setChats } = ChatData();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/messages", {
        message: textMsg,
        receiverId: selectedChat.users[0]._id,
      });

      setMessages((message) => [...message, data]);
      setTextMsg("");
      
      setChats((prev) => {
        const updatedChat = prev.map((chat) => {
          if (chat._id === selectedChat._id) {
            return {
              ...chat,
              lastMessage: {
                text: textMsg,
                sender: data.sender,
              },
            };
          }

          return chat;
        });
        return updatedChat;
      });
    } catch (error) {
      
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="mb-16 sm:mb-0">
      <form onSubmit={handleSendMessage} className="flex items-center w-full">
        <input
          type="text"
          placeholder="Enter message"
          className="border border-gray-300 focus:outline-none rounded-lg p-2 w-[80%] mr-4"
          value={textMsg}
          onChange={(e) => setTextMsg(e.target.value)}
          required
        />
        <button
          type="submit"
          className="text-2xl bg-blue-500 text-white p-2 rounded-full"
          aria-label="Send message"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );

}

export default MessageInput;

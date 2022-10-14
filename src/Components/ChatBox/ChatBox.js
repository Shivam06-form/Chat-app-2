import React, { Fragment } from "react";
import "./ChatBox.css";
import ChatRoom  from "./ChatRoom/ChatRoom";
import AddToRoom  from "./AddToRoom/AddToRoom";
import ChatsLayout from "./ChatsLayout/ChatsLayout";

const Chatbox = () => {
  return (
    <div className="chat-box">
      <ChatRoom />
      <ChatsLayout />
      <AddToRoom/>
    </div>
  );
};

export default Chatbox;

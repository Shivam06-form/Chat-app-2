import React, { Fragment, useContext, useEffect, useState } from "react";
import "./ChatRoom.css";
import { database } from "../../Auth/firebase";
import uuid4 from "uuid4";
import AuthContext from "../../Auth/Login-Auth";

const ChatRoom = () => {
  const [Chatroom, setIsChatroom] = useState("");
  const [renderChats, setRenderChats] = useState("");
  const [Lstmsg, setLstmsg] = useState("");

  const AuthCtx = useContext(AuthContext);

  let id = uuid4();

  useEffect(() => {
    let CHATROOM = [];

    database.ref("ChatRoom").on("child_added", (value) => {
      if (value) {
        CHATROOM.push(value.val());
      }

      if (!AuthCtx.ChatRoomId && value.val().Members[AuthCtx.fakeId]) {
        AuthCtx.ChatRoom(value.val().id, value.val().Chatroom);
      }
      setRenderChats(CHATROOM);
    });
  }, [AuthCtx.ChatRoomId, Chatroom ,AuthCtx.lastMessgae]);

  // useEffect(() => {
  //   if (renderChats) {
  //     const membersList =
  //       renderChats[renderChats.length - 1].Members[AuthCtx.fakeId];
  //     AuthCtx.ChatRoom(membersList.id, membersList.Chatroom);
  //   }
  // }, []);

  useEffect(() => {
    database
      .ref(`Lastmessage/${AuthCtx.ChatRoomId}/${AuthCtx.id}`)
      .on("child_added", (value) => {
        setLstmsg(value.val());
      });
  }, [AuthCtx.ChatRoomId, AuthCtx.id, AuthCtx.lastMessgae]);

  const ChatroomList = (renderChats || []).map((chatRoom) => {
    // console.log(Lstmsg ===chatRoom.Lastmessage);

    let CHATROOM = [];
    if (chatRoom.Members) {
      Object.values(chatRoom.Members).forEach((member) => {
        CHATROOM.push(member);
      });
    }

    const filterChats = CHATROOM.map(
      (chatRoom) => chatRoom.Memberid === AuthCtx.fakeId
    );

    const getTrue = filterChats.filter((member) => member === true);

    return (
      <Fragment key={chatRoom.id}>
        {" "}
        {getTrue[0] && (
          <div
            className={`room-title ${
              chatRoom.id === AuthCtx.ChatRoomId ? "room-title--select" : ""
            }`}
            key={chatRoom.id}
            onClick={() => {
              AuthCtx.ChatRoom(chatRoom.id, chatRoom.Chatroom);
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>{chatRoom.Chatroom}</div>
              {Lstmsg !== chatRoom.Lastmessage && (
                <div
                  style={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "20px",
                    background: "green",
                    marginBottom: "auto",
                    marginTop: "auto",
                  }}
                ></div>
              )}
            </div>
            <div className="room-title-message">
              {chatRoom.Lastmessage &&
                !chatRoom.Lastmessage.includes("firebasestorage") && (
                  <div>{chatRoom.Lastmessage}</div>
                )}
              <div>
                {chatRoom.Lastmessage &&
                  chatRoom.Lastmessage.includes("firebasestorage") && (
                    <img
                      src={chatRoom.Lastmessage}
                      alt={chatRoom.Lastmessage}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50px",
                      }}
                    />
                  )}
              </div>
              {chatRoom.date && (
                <div>
                  {chatRoom.date.Date} {chatRoom.date.Month}
                </div>
              )}
            </div>
          </div>
        )}
      </Fragment>
    );
  });

  return (
    <div className="chat-room">
      <div>{(renderChats || []).length ? ChatroomList : "NO ROOMS YET!"}</div>
      <div className="Add-Chat-room ">
        <input
          type="search"
          value={Chatroom}
          placeholder="New Chat"
          className="w-100"
          style={{ borderRadius: "8px" }}
          onChange={(e) => {
            setIsChatroom(e.target.value);
          }}
        />
        {
          <button
            disabled={!Chatroom}
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              database.ref(`ChatRoom/${id}`).set({
                Chatroom: Chatroom,
                id: id,
                Date: new Date().toISOString(),
                Name: AuthCtx.userName,
              });
              database.ref(`ChatRoom/${id}/Members/${AuthCtx.fakeId}`).set({
                Memberid: AuthCtx.fakeId,
                Owner: true,
                Name: AuthCtx.userName,
              });

              setIsChatroom("");
            }}
          >
            +
          </button>
        }
      </div>
    </div>
  );
};

export default ChatRoom;

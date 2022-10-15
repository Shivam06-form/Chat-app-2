import React, { useContext, useEffect, useRef, useState } from "react";
import { database, storage } from "../../Auth/firebase";
import "./ChatsLayout.css";
import uuid4 from "uuid4";
import { BsFillImageFill } from "react-icons/bs";
import { TbSend } from "react-icons/tb";
import AuthContext from "../../Auth/Login-Auth";

const ChatsLayout = () => {
  const AuthCtx = useContext(AuthContext);
  const [isMessages, setIsMessages] = useState("");
  const [userImg, setUserImg] = useState("");
  const [RenderMsg, setRenderMsg] = useState("");
  const [isUser, setIsUser] = useState();
  const [isImg, setIsImg] = useState(false);
  const isImage = useRef();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let mounth = months[new Date().getMonth()];

  let date = { Date: new Date().getDate(), Month: mounth.slice(0, 3) };

  const selectFile = (e) => {
    isImage.current.click();
  };

  useEffect(() => {
    let MsgList = [];

    database
      .ref(`ChatRoom/${AuthCtx.ChatRoomId}/Messages`)
      .on("value", (values) => {
        if (values.val()) {
          Object.values(values.val()).forEach((value) => {
            MsgList.push(value);
          });
        }

        setRenderMsg(MsgList);
      });
  }, [AuthCtx.ChatRoomId, AuthCtx.fakeId, isMessages, isImg]);

  useEffect(() => {
    database.ref(`/UsersImage`).on("value", (value1) => {
      // console.log(value1.val());
      setUserImg(value1.val());
    });
  }, [AuthCtx.ChatRoomId]);

  useEffect(() => {
    let UersList = [];
    database.ref(`ChatRoom/${AuthCtx.ChatRoomId}`).on("value", (value) => {
      if (value.val()) {
        Object.values(value.val().Members).forEach((member) => {
          UersList.push(member);
          setIsUser(UersList);
        });
      }
    });
  }, [AuthCtx.ChatRoomId, isMessages, AuthCtx.lastMessgae]);

  const renderUsers = (isUser || []).map((user) => {
    return (
      <div key={user.id} style={{ padding: "3px" }}>
        {user.Name}
      </div>
    );
  });

  const renderMsg = (RenderMsg || []).map((msg) => {
    // console.log(userImg[msg.userId]);

    return (
      <div
        key={msg.id}
        style={{
          color: `${msg.userId === AuthCtx.fakeId ? "white" : "black"}`,
          fontFamily: "monospace",
          fontSize: "15px",
          marginLeft: `${msg.userId === AuthCtx.fakeId ? "auto" : ""}`,
          marginRight: `${msg.userId !== AuthCtx.fakeId ? "auto" : ""}`,
          padding: "3px",
          width: "auto",
        }}
      >
        <div style={{ display: "flex" }}>
          {msg.userId !== AuthCtx.fakeId && (
            <img
              src={
                userImg[msg.userId]
                  ? userImg[msg.userId].image
                  : "https://th.bing.com/th/id/OIP.cFOSlfvYLPhm0CzKyu5sugAAAA?pid=ImgDet&rs=1"
              }
              alt="image1"
              style={{ width: "40px", height: "40px", borderRadius: "100px" }}
            />
          )}
          {!msg.message.includes("firebasestorage") && (
            <h6
              style={{
                padding: 10,
                marginLeft: 10,
                backgroundColor: `${
                  msg.userId === AuthCtx.fakeId ? "purple" : "#CBC3E3"
                }`,
                textAlign: "center",
                borderRadius: "10px",
                width: "auto",
              }}
            >
              {" "}
              {msg.message}{" "}
            </h6>
          )}
          {msg.message.includes("firebasestorage") && (
            <img
              src={msg.message}
              alt={msg.message}
              style={{ width: "150px", height: "150px" }}
            />
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="chat-layout">
      <div>
        {" "}
        {AuthCtx.ChatRoomId && (
          <h5 style={{ fontSize: "23px", fontWeight: "bolder" }}>
            {AuthCtx.ChatRoomName}
          </h5>
        )}
        {!AuthCtx.ChatRoomId && <h4>No chat room!</h4>}
        <div
          style={{
            display: "flex",
            fontWeight: "lighter",
            color: "lightblue",
            fontFamily: "monospace",
            margin: "auto",
            justifyContent: "center",
            flexDirection: "row-reverse",
            fontSize: "15px",
            width: "100%",
          }}
        >
          {renderUsers}
        </div>
      </div>
      <div className="render-msg">{renderMsg}</div>
      {isImg && "sending......"}
      {AuthCtx.ChatRoomId && (
        <form className="send-message">
          <input
            type="file"
            accept=".jpg,.jpge,.png"
            ref={isImage}
            style={{ display: "none" }}
            onChange={async (e) => {
              try {
                console.log("sending/.........");
                setIsImg(true);
                storage
                  .ref(`/ChatRoom/Messages/${AuthCtx.ChatRoomId}/${uuid4()}`)
                  .put(e.target.files[0])
                  .then(
                    async (response) =>
                      await response.ref
                        .getDownloadURL()
                        .then((downloadURL) => {
                          database
                            .ref(`/ChatRoom/${AuthCtx.ChatRoomId}/Messages`)
                            .push({
                              message: downloadURL,
                              id: uuid4(),
                              userId: AuthCtx.fakeId,
                              date: date,
                            });
                          database
                            .ref(`ChatRoom/${AuthCtx.ChatRoomId}/Lastmessage`)
                            .set(downloadURL);
                          setIsImg(false);
                          console.log("sended.......");
                        })
                  );
              } catch (error) {
                console.log(error.message);
              }
            }}
          />
          <input
            type="text"
            value={isMessages}
            placeholder="Send Message..."
            className="w-75 input-group"
            style={{ borderStyle: "none", justifyContent: "start" }}
            onChange={(e) => {
              setIsMessages(e.target.value);
            }}
          />
          <BsFillImageFill size={24} className="icon" onClick={selectFile} />
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              database.ref(`/ChatRoom/${AuthCtx.ChatRoomId}/Messages`).push({
                message: isMessages,
                id: uuid4(),
                userId: AuthCtx.fakeId,
                date: date,
              });
              database
                .ref(`ChatRoom/${AuthCtx.ChatRoomId}/Lastmessage`)
                .set(isMessages);
              database.ref(`ChatRoom/${AuthCtx.ChatRoomId}/date`).set(date);
              database
                .ref(`Lastmessage/${AuthCtx.ChatRoomId}/${AuthCtx.id}`)
                .set({ message: isMessages });

              setIsMessages("");
              AuthCtx.getLastMsg(isMessages);
            }}
            className="btn btn--white"
          >
            {" "}
            {isMessages !== "" && <TbSend size={24} className="icon" />}
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatsLayout;

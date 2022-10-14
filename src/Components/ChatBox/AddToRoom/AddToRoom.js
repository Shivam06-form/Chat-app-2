import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./AddToRoom.css";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import AddPeople from "./AddPeople";
import Photos from "./Photos";
import Options from "./Options";
import AuthContext from "../../Auth/Login-Auth";
import { database } from "../../Auth/firebase";

const ChatRoom = () => {
  const [showPeople, setShowPeople] = useState(false);
  const [islist, setIslist] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState("");
  const AuthCtx = useContext(AuthContext);

  useEffect(() => {
    let UersList = [];
    database.ref(`ChatRoom/${AuthCtx.ChatRoomId}`).on("value", (value) => {
      Object.values(value.val().Members).forEach((member) => {
        UersList.push(member);
      });
      setIslist(UersList);
    });
  }, [showPeople, AuthCtx.lastMessgae, AuthCtx.ChatRoomId]);

  useEffect(() => {
    let isLogged = [];
    database.ref(`Status`).on("child_added", (status) => {
      isLogged.push(status.val());
      setIsLoggedIn(isLogged);
    });
  }, [AuthCtx.id]);

  const RenderUsers = (islist || []).map((member) => {
    const filter = (isLoggedIn || []).map(
      (log) => log.Login === member.Memberid
    );

    const getTrue = filter.filter((use) => use === true);

    return (
      <div key={member.Memberid}>
        {
          <div className="people-list-inside">
            <div
              style={{
                height: "5px",
                width: "5px",
                borderRadius: "10px",
                background: `${getTrue[0] ? "green" : "red"}`,
                marginBottom: "auto",
              }}
            ></div>
            <img
              src={
                member.image
                  ? member.image
                  : `https://c4.wallpaperflare.com/wallpaper/480/539/646/zipper-hero-hero-dc-comics-shazam-hd-wallpaper-preview.jpg`
              }
              alt="pic"
              style={{
                width: "35px",
                height: "35px",
                borderRadius: 100,
                marginRight: "2px",
              }}
            />
            <div>{member.Name}</div>
          </div>
        }
      </div>
    );
  });

  return (
    <div className="addChat-room">
      <div className="card-addChat-room">
        {" "}
        {AuthCtx.ChatRoomName ? AuthCtx.ChatRoomName : "Nothing Yet"}{" "}
      </div>
      <div className="people">
        <div> People </div>{" "}
        {!showPeople && (
          <AiOutlineRight
            size={23}
            onClick={() => setShowPeople(true)}
            style={{ cursor: "pointer" }}
          />
        )}
        {showPeople && (
          <AiOutlineLeft
            size={23}
            onClick={() => setShowPeople(false)}
            style={{ cursor: "pointer" }}
          />
        )}
      </div>
      {showPeople && <div className="people-list">{RenderUsers}</div>}{" "}
      <AddPeople />
      <Photos />
      <Options />
    </div>
  );
};

export default ChatRoom;

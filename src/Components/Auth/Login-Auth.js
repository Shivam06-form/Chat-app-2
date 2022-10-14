import { createContext, useReducer } from "react";
import { database } from "./firebase";

const AuthContext = createContext({
  isLogined: false,
  userName: "",
  Login: () => {},
  Logout: () => {},
  ChatRoom: () => {},
  ProfileLogin: () => {},
  profileid: "",
  ChatRoomId: "",
  ChatRoomName: "",
  fakeId: "",
  id: "",
  lastMessgae: "",
  getLastMsg: () => {},
});

const defualtState = {
  profileid: "",
  lastMessgae: "",
  userName: "",
  isLogined: false,
  ChatRoomId: "",
  ChatRoomName: "",
  fakeId: "",
  id: "",
};

const LoginReducer = (state, action) => {
  if (action.type === "Logout") {
    localStorage.removeItem("userName");
    database.ref(`Status/${state.id}/Login`).set(null);
    return { ...defualtState, isLogined: false };
  }

  if (action.type === "Login") {
    localStorage.setItem("userName", action.id);
    database.ref(`Status/${state.id}/Login`).set(action.fakeId);
    database.ref(`Users/${action.id}`).set({
      Name: action.userName,
      fakeId: action.fakeId,
      id: action.id,
      Login: true,
    });
    return {
      ...state,
      isLogined: true,
      userName: (state.userName = action.userName),
      fakeId: (state.fakeId = action.fakeId),
      id: (state.id = action.id),
    };
  }

  if (action.type === "Profile_Login") {
    localStorage.setItem("userName", action.profileid);
    return { ...state, profileid: (state.profileid = action.profileid) };
  }

  if (action.type === "ChatRoom") {
    return {
      ...state,
      ChatRoomId: (state.ChatRoomId = action.ChatRoomId),
      ChatRoomName: (state.ChatRoomName = action.ChatRoomName),
    };
  }

  if (action.type === "LAST_CHAT") {
    return { ...state, lastMessgae: (state.lastMessgae = action.lastMessgae) };
  }

  return defualtState;
};

export const AuthContextProvider = (props) => {
  const [State, dispatchAction] = useReducer(LoginReducer, defualtState);

  const Login = (userName, fakeId, id) => {
    dispatchAction({
      type: "Login",
      userName: userName,
      fakeId: fakeId,
      id: id,
    });
  };

  const Logout = (id) => {
    dispatchAction({ type: "Logout", id: id });
  };

  const ProfileLogin = (profileid) => {
    dispatchAction({
      type: "Profile_Login",
      profileid: profileid,
    });
  };

  const ChatRoom = (ChatRoomId, ChatRoomName) => {
    dispatchAction({
      type: "ChatRoom",
      ChatRoomId: ChatRoomId,
      ChatRoomName: ChatRoomName,
    });
  };

  const getLastMsg = (lastMessgae) => {
    dispatchAction({ type: "LAST_CHAT", lastMessgae: lastMessgae });
  };

  const ContextValue = {
    isLogined: State.isLogined,
    userName: State.userName,
    Login: Login,
    Logout: Logout,
    ChatRoom: ChatRoom,
    ProfileLogin: ProfileLogin,
    getLastMsg: getLastMsg,
    ChatRoomId: State.ChatRoomId,
    ChatRoomName: State.ChatRoomName,
    fakeId: State.fakeId,
    id: State.id,
    profileid: State.profileid,
    lastMessgae: State.lastMessgae,
  };

  return (
    <AuthContext.Provider value={ContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

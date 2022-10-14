import React, { Fragment, useContext } from "react";
import AuthContext from "../Auth/Login-Auth";
import Chatbox from "../ChatBox/ChatBox";
import Login from "../Login/Login";

const MainContent = () => {
  const AuthCtx = useContext(AuthContext);

  return (
    <Fragment>
      {!AuthCtx.isLogined && <Login />}
      {AuthCtx.isLogined && <Chatbox />}
    </Fragment>
  );
};

export default MainContent;

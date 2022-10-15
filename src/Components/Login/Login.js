import React, { useContext, useState } from "react";
import { auth, database } from "../Auth/firebase";
import AuthContext from "../Auth/Login-Auth";
import "./Login.css";
import uuid4 from "uuid4";

const Login = () => {
  const AuthCtx = useContext(AuthContext);
  const [Email, isEmail] = useState("");
  const [LoggedIn, isLoggedIn] = useState(false);
  const [Error, isError] = useState("");
  const [Password, isPassword] = useState("");

  const EmailandPasswordSignUp = async (e) => {
    auth
      .createUserWithEmailAndPassword(`${Email}@gmail.com`, Password)
      .then((response) => {
        console.log(response);
        if (response.additionalUserInfo) {
          AuthCtx.Login(Email, uuid4(), response.user.uid);
        }

        if (response.additionalUserInfo) {
          AuthCtx.ProfileLogin(response.user.uid);
          console.log(AuthCtx.profileid);
        }
      })
      .catch((error) => {
        isError(error.message);
      });
  };

  const EmailandPasswordSignin = async (e) => {
    auth
      .signInWithEmailAndPassword(`${Email}@gmail.com`, Password)
      .then((response) => {
        console.log(response);
        if (response.additionalUserInfo.isNewUser) {
          AuthCtx.Login(Email, uuid4(), response.user.uid);
        }
        if (response.additionalUserInfo) {
          AuthCtx.ProfileLogin(response.user.uid);
        }
      })
      .catch((error) => {
        isError(error.message);
      });
  };

  return (
    <div className="form-container">
      {" "}
      <form className="form-card">
        <h1>Chat Application</h1>
        <input
          className="form-input"
          type="Username"
          placeholder="Username 👨‍🏫"
          onChange={(e) => {
            isEmail(e.target.value);
          }}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password 🔑"
          onChange={(e) => {
            isPassword(e.target.value);
          }}
        />
        {/* <input
          className="form-input"
          type="password"
          placeholder="Re Enter Your Password 🔑"
        /> */}
        {Error && (
          <h5
            style={{ backgroundColor: "wheat", color: "white", padding: "4px" }}
          >
            {Error}
          </h5>
        )}
        {!LoggedIn && (
          <h5
            className="btn reviews__text "
            style={{ color: "white", fontSize: "18px" }}
            onClick={(e) => {
              e.preventDefault();
              isLoggedIn(true);
            }}
          >
            {" "}
            SignUp
          </h5>
        )}
        {LoggedIn && (
          <h5
            className="btn reviews__text "
            style={{ color: "white", fontSize: "18px" }}
            onClick={(e) => {
              e.preventDefault();
              isLoggedIn(false);
            }}
          >
            SignIn
          </h5>
        )}
        <button
          disabled={!Email && !Password}
          className="button"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            console.log("LoggedIn");
            LoggedIn ? EmailandPasswordSignin() : EmailandPasswordSignUp();
          }}
        >
          START CHATTING ({LoggedIn ? "SignIn" : "SignUp"})
        </button>
      </form>
    </div>
  );
};

export default Login;

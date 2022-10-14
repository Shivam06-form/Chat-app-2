import { useContext, useEffect } from "react";
import { database } from "./Components/Auth/firebase";
import AuthContext from "./Components/Auth/Login-Auth";
import MainContent from "./Components/MainContent/MainContent";

function App() {
  const AuthCtx = useContext(AuthContext);
  const getItem = localStorage.getItem("userName");

  useEffect(() => {
    database.ref(`Users/${getItem}`).on("value", (value) => {
      if (getItem && value) {
        AuthCtx.Login(
          value.val().Name ? value.val().Name : "",
          value.val().fakeId ? value.val().fakeId : "",
          value.val().id ? value.val().id : ""
        );
      }
    });
  }, [AuthCtx.fakeId, getItem]);

  return <MainContent />;
}

export default App;

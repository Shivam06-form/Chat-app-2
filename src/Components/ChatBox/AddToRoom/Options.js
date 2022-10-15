import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { database, storage } from "../../Auth/firebase";
import AuthContext from "../../Auth/Login-Auth";

const Options = () => {
  const [showPeople, setShowPeople] = useState(false);
  const getItem = localStorage.getItem("userName");
  const AuthCtx = useContext(AuthContext);
  const [userImg, setUserImg] = useState(false);
  const [Avavtar, setAvavtar] = useState("");

  const setAvatar = useRef();

  const selectFile = (e) => {
    setAvatar.current.click();
    console.log("image");
  };

  useEffect(() => {
    database.ref(`UsersImage/${AuthCtx.fakeId}`).on("value", (value) => {
      if (value.val()) {
        setAvavtar(value.val().image);
      }
    });
  }, [AuthCtx.fakeId, AuthCtx.id]);

  return (
    <Fragment>
      <div className="people" style={{ marginTop: "40px" }}>
        <div> Options </div>{" "}
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
      {showPeople && (
        <div>
          <div>
            <img
              src={
                Avavtar
                  ? Avavtar
                  : "https://th.bing.com/th/id/OIP.cFOSlfvYLPhm0CzKyu5sugAAAA?pid=ImgDet&rs=1"
              }
              alt="imgs"
              style={{
                width: `${Avavtar ? "90%" : "60%"}`,
                height: `${Avavtar ? "90%" : "60%"}`,
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            />
            <input
              type="file"
              ref={setAvatar}
              style={{ display: "none" }}
              onChange={(e) => {
                try {
                  setUserImg(true);
                  storage
                    .ref(
                      `ChatRoom/${AuthCtx.ChatRoomId}/Members/${AuthCtx.fakeId}/image`
                    )
                    .put(e.target.files[0])
                    .then(async (data) => {
                      await data.ref.getDownloadURL().then((downloadURL) => {
                        // database
                        //   .ref(
                        //     `ChatRoom/${AuthCtx.ChatRoomId}/Members/${AuthCtx.fakeId}/image`
                        //   )
                        //   .set(downloadURL);
                        database
                          .ref(`UsersImage/${AuthCtx.fakeId}/image`)
                          .set(downloadURL);
                        setUserImg(false);
                      });
                    });
                } catch (error) {
                  console.log(error.message);
                }
              }}
            />
            <button
              style={{
                marginBottom: "20px",
              }}
              className="btn btn-success"
              onClick={selectFile}
              disabled={userImg}
            >
              Pick An Image ℹ
            </button>
            {userImg && <h5>Uploading Avatar... </h5>}
          </div>{" "}
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log(AuthCtx.id);
              AuthCtx.Logout(getItem);
            }}
            className="btn btn-danger text-bg-light"
          >
            Logout 🔓
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default Options;

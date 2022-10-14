import React, { Fragment, useContext, useEffect, useState } from "react";
import { database } from "../../Auth/firebase";
import AuthContext from "../../Auth/Login-Auth";

const AddPeople = () => {
  const [Search, setSearch] = useState("");
  const AuthCtx = useContext(AuthContext);
  const [view, setView] = useState(false);
  const [isList, setIsList] = useState();

  useEffect(() => {
    let UersList = [];
    database.ref(`Users`).on("child_added", (value) => {
      UersList.push(value.val());
    });
    // console.log(AuthCtx.lastMessgae)
    setIsList(UersList);
  }, [view, AuthCtx.lastMessgae]);

  const ProductList = (isList || []).filter((Product) =>
    (Product.Name ? Product.Name : "")
      .trim()
      .toLocaleLowerCase()
      .includes(Search.trim().toLocaleLowerCase())
  );

  const RenderUser = (ProductList || []).map((user) => {
    let UersList = [];
    database.ref(`ChatRoom/${AuthCtx.ChatRoomId}`).on("value", (value) => {
      if (value.val()) {
        Object.values(value.val().Members).forEach((member) => {
          UersList.push(member);
        });
      }
    });
    const filterUser = UersList.map(
      (member) => member.Name === user.Name || member.Owner !== true
    );
    const getTrue = filterUser.filter((use) => use === true);

    return (
      <Fragment key={user.id}>
        {user.fakeId !== AuthCtx.fakeId && !getTrue[0] && (
          <div
            style={{
              textAlign: "start",
              fontSize: "16px",
              fontFamily: "serif",
            }}
            onClick={() => {
              setView(false);
              database
                .ref(`ChatRoom/${AuthCtx.ChatRoomId}/Members/${user.fakeId}`)
                .set({ Memberid: user.fakeId, Name: user.Name });
            }}
          >
            {user.Name}
          </div>
        )}
      </Fragment>
    );
  });

  return (
    <div className="search-people">
      <input
        value={Search}
        type="search"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onClick={(e) => {
          setView(true);
        }}
        className="form-control"
        placeholder="Type to search..."
      />
      {view && (
        <div className="card">
          {RenderUser}{" "}
          <div
            onClick={() => {
              setView(false);
            }}
            style={{ textAlign: "center" }}
          >
            X
          </div>{" "}
        </div>
      )}
    </div>
  );
};

export default AddPeople;

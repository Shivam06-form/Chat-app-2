import React, { useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

const Photos = () => {
  const [showPeople, setShowPeople] = useState(false);

  return (
    <div className="people" style={{ marginTop: "40px" }}>
      <div> Photos </div>{" "}
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
  );
};

export default Photos;

import React from "react";
import "./Thinks.css";

const Thinks = (props) => {
  return (
    <>
      {props.user.bio && (
        <div
          onClick={() => props.setActiveFriend(props.user.id)}
          className="thinks"
        >
          <div className="img-wrp">
            <img alt="profile" src={props.user.profilePic} />
            <p>{props.user.bio}</p>
          </div>
          <h5>{props.user.name}</h5>
        </div>
      )}
    </>
  );
};

export default Thinks;

import React, { useEffect, useState } from "react";

import "./UnSeen.css";

const UnSeen = (props) => {
  const [friend, setFriend] = useState();

  const getUser = () => {
    props.users
      .filter((f) => {
        return f.id === props.user.id;
      })
      .map((f) => {
        setFriend(f);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {friend && (
        <div className="unseen">
          <div className="img-wrp">
            <img alt="profile" src={friend.profilePic} />
          </div>
          <h3>{friend.name}</h3>
        </div>
      )}
    </>
  );
};

export default UnSeen;

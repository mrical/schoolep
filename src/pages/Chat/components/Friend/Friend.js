import { update, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { db, rdb } from "../../../../firebase";

import { motion } from "framer-motion";
import { useChat } from "../../../../context/ChatContext";
import { doc, updateDoc } from "firebase/firestore";

const Friend = (props) => {
  const { dispatch, data } = useChat();

  const handleSelect = async (id) => {
    dispatch({ type: "CHANGE_USER", payload: id });
  };

  const [friend, setFriend] = useState();

  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  useEffect(() => {
    props.allUsers
      .filter((f) => {
        return f.id === props.friend.id;
      })
      .map((f) => {
        setFriend(f);
      });
  }, [loading]);

  useEffect(() => {
    if (friend) {
      if (data.user === friend.id) {
        updateDoc(
          doc(db, "users/" + currentUser.uid + "/messages/" + data.user),
          {
            saw: true,
            sawTime: new Date().valueOf(),
          }
        );
        updateDoc(
          doc(db, "users/" + data.user + "/messages/" + currentUser.uid),
          {
            saw: true,
            sawTime: new Date().valueOf(),
          }
        );
      }
    }
  }, [data.user]);

  return (
    <>
      {friend && props.friend && (
        <div
          className={props.friend.id === data.user ? "friend active" : "friend"}
          onClick={() => {
            handleSelect(props.friend.id);
            props.setSearchFriend("");
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="wrapper"
          >
            <div className="img-mood">
              <img
                alt="profile"
                src={
                  friend.profilePic ||
                  "https://i.postimg.cc/zfP6Tk3W/profile-pic-default.png"
                }
              />
              <span>{friend.mood}</span>
            </div>
            <div className="right-side">
              <h4>{friend.block ? "Blocked Account" : friend.name}</h4>
              {props.friend.message && (
                <p className={props.friend.saw ? "null" : "saw_false"}>
                  {props.friend.toId === friend.id
                    ? props.friend.message.length > 25
                      ? "Me: " + props.friend.message.substr(0, 25) + "..."
                      : "Me: " + props.friend.message
                    : props.friend.message.length > 25
                    ? props.friend.message.substr(0, 25) + "..."
                    : props.friend.message}
                </p>
              )}
              {!props.friend.message && <p className="null">{friend.email}</p>}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Friend;

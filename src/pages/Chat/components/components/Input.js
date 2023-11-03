import React, { useState } from "react";
import { useChat } from "../../../../context/ChatContext";
import { useAuth } from "../../../../context/AuthContext";
import { db, rdb } from "../../../../firebase";
import useFetchUsers from "../../../../utilis/getUsers";
import { Send } from "@mui/icons-material";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { push, ref } from "firebase/database";

const Input = () => {
  const { data } = useChat();
  const { currentUser } = useAuth();

  const [message, setMessage] = useState("");
  const [users, setUsers] = useState();
  const [allUsers, setAllUsers] = useState();

  useFetchUsers(setUsers, setAllUsers);

  //handler for sending messages
  const handleSendMessage = async () => {
    try {
      if (message.length > 0) {
        sendMessage(currentUser.uid, data.user, message, new Date().valueOf());
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Send message to Firestore database
  const sendMessage = async (fromId, toId, message, date) => {
    const autoId = push(ref(rdb, "message")).key;
    setDoc(doc(db, "users/" + currentUser.uid + "/messages/" + toId), {
      message: message,
      timestamp: new Date().valueOf(),
      fromId: currentUser.uid,
      toId: toId,
      id: toId,
      saw: true,
      name: allUsers
        .filter((user) => {
          return user.id === data.user;
        })
        .map((user) => {
          return user.name;
        }),
    });
    updateDoc(doc(db, "users/" + toId + "/messages/" + currentUser.uid), {
      message: message,
      timestamp: new Date().valueOf(),
      fromId: currentUser.uid,
      toId: toId,
      id: currentUser.uid,
      saw: false,
      name: allUsers
        .filter((user) => {
          return user.id === data.user;
        })
        .map((user) => {
          return user.name;
        }),
    });
    updateDoc(doc(db, "messages/" + toId + fromId), {
      [autoId]: {
        date: date,
        fromId: fromId,
        id: autoId,
        message,
        toId: toId,
      },
    });
    updateDoc(doc(db, "messages/" + fromId + toId), {
      [autoId]: {
        date: date,
        fromId: fromId,
        id: autoId,
        message,
        toId: toId,
      },
    });
  };
  //sending messages by enter
  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="bottom-bar send-message">
        <div className="send-message">
          <input
            onKeyUp={keyDownHandler}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
          />
          <Send onClick={handleSendMessage} className="send-icon" />
        </div>
      </div>
    </>
  );
};

export default Input;

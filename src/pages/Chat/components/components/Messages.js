import React, { useEffect, useState } from "react";
import { useChat } from "../../../../context/ChatContext";
import { onValue, ref } from "firebase/database";
import { db, rdb } from "../../../../firebase";
import { useAuth } from "../../../../context/AuthContext";
import Message from "./Message";
import { collection, doc, onSnapshot } from "firebase/firestore";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useChat();
  const { currentUser } = useAuth();

  useEffect(() => {
    const starCountRef = doc(db, `messages/${data.chatId}/`);
    const unSub = onSnapshot(
      starCountRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) return;
        const data = docSnapshot.data();
        const array = [];
        for (let i in data) {
          array.push(data[i]);
        }
        setMessages(array.sort((a,b)=>a.date-b.date));
      },
      (error) => {
        console.log("messages", error);
      }
    );

    return () => {
      unSub();
    };
  }, [data.chatId]);

  useEffect(() => {
    const starCountRef = collection(
      db,
      `users/${currentUser.uid}/messages/${data.user}/sawTime`
    );
    const unSub = onSnapshot(
      starCountRef,
      (docSnapshot) => {
        const data = docSnapshot.docs.map((doc) => doc.data());
      },
      (error) => {
        console.log("sawTime", error);
      }
    );

    return () => {
      unSub();
    };
  }, [data.user]);

  //mobile responsive hiding search friends and showing chat and reverse
  useEffect(() => {
    let friends = document.getElementById("friends");
    let chat = document.getElementById("messages");
    if (data.user && document.body.clientWidth < 1100) {
      friends.classList.add("hide-friends");
      chat.classList.add("show-chat");
    }

    if (!data.user && document.body.clientWidth < 1100) {
      friends.classList.remove("hide-friends");

      chat.classList.remove("show-chat");
    }
  }, [data.user]);

  return (
    <>
      {data.chatId && (
        <div id="chat-center" className="center-bar messages">
          {messages.map((m) => (
            <Message key={m.id} {...m} />
          ))}
        </div>
      )}
    </>
  );
};

export default Messages;

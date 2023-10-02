import { ArrowBack, MoreVert } from "@mui/icons-material";
import { onValue, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db, rdb } from "../../../../firebase";
import { useChat } from "../../../../context/ChatContext";
import { useAuth } from "../../../../context/AuthContext";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";

const TopBar = (props) => {
  const { data, dispatch } = useChat();
  const { currentUser } = useAuth();

  const [deleteSection, setDeleteSection] = useState(false);

  //delete chat
  const handleDeleteChat = () => {
    deleteDoc(doc(db, "messages/" + currentUser.uid + data.user));

    dispatch({ type: "CLOSE_USER" });

    deleteDoc(doc(db, "users/" + currentUser.uid + "/messages/" + data.user));
  };

  const [dataActiveFriend, setDataActiveFriend] = useState();

  useEffect(() => {
    const starCountRef = doc(db, `users/` + data.user);
    const unChng = onSnapshot(starCountRef, (docSnapshot) => {
      if (!docSnapshot.exists()) return;
      const d = docSnapshot.data();
      console.log("d",d)
      setDataActiveFriend(d);
    });

    return () => {
      unChng();
    };
  }, [data.user, setDataActiveFriend]);

  return (
    <>
      {dataActiveFriend && (
        <div className="top-bar">
          <div className="wrapper">
            <ArrowBack
              className="chat-left"
              onClick={() => {
                setDataActiveFriend();
                let friends = document.getElementById("friends");
                let chat = document.getElementById("messages");
                friends.classList.remove("hide-friends");
                dispatch({ type: "CLOSE_USER" });
                chat.classList.remove("show-chat");
              }}
            />
            <img alt="profile" src={dataActiveFriend.profilePic} />
            <h3>
              {dataActiveFriend.block
                ? "Blocked Account"
                : dataActiveFriend.name}
            </h3>
          </div>

          {deleteSection && (
            <div onClick={handleDeleteChat} className="delete-section">
              <a>Delete</a>
            </div>
          )}
          <div>
            <MoreVert
              className="more-top"
              onClick={() => setDeleteSection(!deleteSection)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;

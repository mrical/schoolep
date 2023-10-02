import {
  ArrowBack,
  ArrowForward,
  MoreVert,
  Search,
  Send,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import "./Chat.css";
import { db, rdb } from "../../firebase.js";
import { useAuth } from "../../context/AuthContext";

import {
  child,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  startAt,
} from "firebase/database";
import Thinks from "../../components/Thinks/Thinks";

import { motion } from "framer-motion";
import useFetchUsers from "../../utilis/getUsers";
import useFetchUserData from "../../utilis/getUser";
import useFetchUserFriends from "../../utilis/getFriends";
import { useChat } from "../../context/ChatContext";
import CurrentChat from "./components/CurrentChat";
import Friend from "./components/Friend/Friend";
import StartChat from "./components/StartChat";
import { collection, doc, onSnapshot, orderBy } from "firebase/firestore";

const Chat = () => {
  const [users, setUsers] = useState();
  const [allUsers, setAllUsers] = useState();
  const [allFriends, setAllFriends] = useState();
  const [searchFriend, setSearchFriend] = useState("");
  const [activeFriend, setActiveFriend] = useState("");
  const [loading, setLoading] = useState(true);

  const [friends, setFriends] = useState();

  const [findFriends, setFindFriends] = useState();

  const { currentUser } = useAuth();

  const [friendsLoading, setFriendsLoading] = useState(true);

  const { data } = useChat();

  //loading chat menu mobile hide
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    document.getElementById("menu").classList.remove("left-menu");
  }, []);

  useFetchUsers(setUsers, setAllUsers);
  useFetchUserFriends(currentUser, setFriends, setAllFriends);

  //mobile responsive hiding search friends and showing chat and reverse
  useEffect(() => {
    let friends = document.getElementById("friends");
    let chat = document.getElementById("messages");
    if (activeFriend && document.body.clientWidth < 1100) {
      friends.classList.add("hide-friends");
      chat.classList.add("show-chat");
    }

    if (!activeFriend && document.body.clientWidth < 1100) {
      friends.classList.remove("hide-friends");

      chat.classList.remove("show-chat");
    }
  }, [activeFriend]);

  const [t, setT] = useState();

  //scroll thoughts
  useEffect(() => {
    if (!friendsLoading) {
      setT(document.getElementById("thinks"));
      if (!t) {
        setT(document.getElementById("thinks"));
      }
    }
  }, [friendsLoading]);

  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu");
    document.body.style.overflow = "visible";
  }, []);

  useEffect(() => {
    if (allFriends) {
      setTimeout(() => {
        setFriendsLoading(false);
      }, 1000);
    }
  }, [friends]);

  const handleSearch = (searchText) => {
    setSearchFriend(searchText);
    if (searchText.length < 1) {
      // Handle minimum search length requirement
      setFindFriends(null);
      return;
    }

    const usersRef = collection(db, "users");
    const queryRef = query(usersRef, orderBy("name"));

    onSnapshot(queryRef, (docSnapshot) => {
      // if (!docSnapshot.exists()) return;
      console.log(docSnapshot);

      const searchData = docSnapshot.docs.map((doc) => doc.data());
      const searchResults = [];
      // console.log(docSnapshot.docs);
      if (searchData) {
        console.log(searchData);
        searchData.forEach((data) => {
          if (data.id === currentUser.uid) {
            return;
          }
          const name = data.name;
          if (name.toLowerCase().includes(searchText.toLowerCase())) {
            searchResults.push(data);
          }
        });
      }
      console.log(searchResults);
      // Handle the search results
      setFindFriends(searchResults);
      // Update state or perform any other actions
    });
  };

  return (
    <div id="chat">
      <div className="wrapper-chat">
        <div className="left-side-friends friends white-box" id="friends">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="search"
          >
            <div className="search-input">
              <Search />
              <input
                value={searchFriend}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search friends..."
              />
            </div>
          </motion.div>
          <div className="friends-searched">
            {friendsLoading && <div className="loader-w"></div>}

            {findFriends &&
              searchFriend.length > 1 &&
              findFriends.map((f) => (
                <Friend
                  allUsers={allUsers}
                  key={f.id}
                  friend={f}
                  setSearchFriend={setSearchFriend}
                />
              ))}

            {allFriends &&
              !friendsLoading &&
              searchFriend.length < 1 &&
              allFriends
                .sort((a, b) => {
                  return b.timestamp - a.timestamp;
                })
                .filter((a) => {
                  return !a.block;
                })
                .map((f) => (
                  <Friend
                    allUsers={allUsers}
                    key={f.id}
                    friend={f}
                    setSearchFriend={setSearchFriend}
                  />
                ))}

            {!friendsLoading &&
              allFriends.length === 0 &&
              searchFriend.length < 1 && (
                <p className="no-friends">
                  You have not any friends yet, just search them
                </p>
              )}
          </div>
        </div>
        <div className="right-side r-messages white-box" id="messages">
          {friendsLoading && <div className="loader-w"></div>}

          {!friendsLoading && data.user ? <CurrentChat /> : <StartChat />}
        </div>
      </div>
    </div>
  );
};

export default Chat;

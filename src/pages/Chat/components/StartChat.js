import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useFetchUserData from "../../../utilis/getUser";
import { useAuth } from "../../../context/AuthContext";
import useFetchUserFriends from "../../../utilis/getFriends";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import useFetchUsers from "../../../utilis/getUsers";
import Thinks from "../../../components/Thinks/Thinks";

const StartChat = () => {
  const { currentUser } = useAuth();

  const [t, setT] = useState();
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [users, setUsers] = useState();
  const [allUsers, setAllUsers] = useState();
  const [friends, setFriends] = useState();
  const [allFriends, setAllFriends] = useState();

  const handleMoveRight = () => {
    t.scroll({
      left: t.scrollLeft + 200,
      behavior: "smooth",
    });
  };

  const handleMoveLeft = () => {
    t.scroll({
      left: t.scrollLeft - 200,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (allFriends) {
      setTimeout(() => {
        setFriendsLoading(false);
      }, 1000);
    }
  }, [friends]);

  //scroll thoughts
  useEffect(() => {
    if (!friendsLoading) {
      setT(document.getElementById("thinks"));
      if (!t) {
        setT(document.getElementById("thinks"));
      }
    }
  }, [friendsLoading]);

  useFetchUsers(setUsers, setAllUsers);
  useFetchUserData(currentUser, setUserData, null);
  useFetchUserFriends(currentUser, setFriends, setAllFriends);

  return (
    <>
      {userData && !friendsLoading && (
        <div className="starter-chat">
          <div className="profile">
            <motion.img
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="st"
              src={userData.profilePic}
            />
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {userData.name}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="st"
            >
              Start chating with your firends.
            </motion.p>
          </div>
          {friends && (
            <div className="thinkers">
              <motion.div
                className="titles"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h4>Friends thoughts</h4>
                <ArrowBack className="icon" onClick={handleMoveLeft} />
                <ArrowForward className="icon" onClick={handleMoveRight} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="thinks-wrp"
                id="thinks"
              >
                <div className="thinks-content">
                  {friends &&
                    users &&
                    allFriends.map((u) =>
                      allUsers
                        .filter((f) => {
                          return f.id === u.id;
                        })
                        .map((u) => <Thinks user={u} />)
                    )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StartChat;

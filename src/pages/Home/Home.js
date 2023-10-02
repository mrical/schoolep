import {
  Add,
  ArrowBack,
  ArrowForward,
  ArrowForwardRounded,
  Message,
  Note,
  TextSnippet,
} from "@mui/icons-material";
import { onValue, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UnSeen from "../../components/UnSeen/UnSeen";
import { useAuth } from "../../context/AuthContext";
import { db, rdb } from "../../firebase";
import "./Home.css";

import { motion } from "framer-motion";

import bot from "../../assets/bot.svg";

import useFetchUserData from "../../utilis/getUser";
import useFetchUserNotes from "../../utilis/getNotes";
import useFetchUserFriends from "../../utilis/getFriends";
import useFetchUsers from "../../utilis/getUsers";
import { doc, updateDoc } from "firebase/firestore";

const Home = () => {
  const { currentUser } = useAuth();

  const [user, setUser] = useState();

  const [notes, setNotes] = useState();
  const [allNotes, setAllNotes] = useState();

  const [newMessage, setNewMessage] = useState(true);

  const [bioLength, setBioLength] = useState();

  const maxBio = 40;

  const [allFriends, setAllFriends] = useState();
  const [friends, setFriends] = useState();

  const [allUsers, setAllUsers] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState();

  const [loadingSave, setLoadingSave] = useState(false);

  const notes_w = document.getElementById("notes_w");

  const handleMoveRight = () => {
    notes_w.scroll({
      left: notes_w.scrollLeft + 200,
      behavior: "smooth",
    });
  };

  const handleMoveLeft = () => {
    notes_w.scroll({
      left: notes_w.scrollLeft - 200,
      behavior: "smooth",
    });
  };

  useFetchUserData(currentUser, setUser, setBio);
  useFetchUserNotes(currentUser, setNotes, setAllNotes);
  useFetchUserFriends(currentUser, setFriends, setAllFriends);
  useFetchUsers(setUsers, setAllUsers);

  //call function after web is loaded
  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu");
    document.body.style.overflow = "visible";
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleChangeMood = (mood) => {
    updateDoc(doc(db, "users/" + currentUser.uid), {
      mood: mood,
    });
  };

  const handleUpdateBio = () => {
    setLoadingSave(true);

    if (bioLength <= maxBio) {
      updateDoc(doc(db, "users/" + currentUser.uid), {
        bio: bio,
      });
    }

    setTimeout(() => {
      setLoadingSave(false);
    }, 1000);
  };

  useEffect(() => {
    if (bio) {
      setBioLength(bio.length);
    }
  }, [bio]);

  useEffect(() => {
    setNewMessage(true);
    if (allFriends) {
      setTimeout(() => {
        setNewMessage(false);
      }, 1000);
    }
  }, [allFriends]);

  return (
    <>
      <div id="home">
        <div className="wrapper-home">
          <div className="content">
            {/* title welcome  */}
            <div className="titles">
              {user && (
                <motion.h3
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome, {user.name}
                </motion.h3>
              )}
            </div>

            <div className="wrapper-3boxes">
              {/* notes */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="small-b box only_notes"
              >
                <div className="title">
                  <TextSnippet className="titles-icon" />
                  <h3>All notes</h3>
                  <Link className="create-icon" to="/notes/create">
                    <Add />
                  </Link>
                  <div className="move_right">
                    <ArrowBack className="icon" onClick={handleMoveLeft} />
                    <ArrowForward className="icon" onClick={handleMoveRight} />
                  </div>
                </div>

                <div className="notes" id="notes_w">
                  {allNotes &&
                    allNotes.map((n) => (
                      <Link
                        className="note-a"
                        to={"/notes/note/" + currentUser.uid + "/" + n.id}
                      >
                        <div className="note" key={n.id}>
                          <Note />
                          {n.note_name && (
                            <h4>
                              {n.note_name.length > 60
                                ? n.note_name.substr(0, 50) + "..."
                                : n.note_name}
                            </h4>
                          )}
                        </div>
                      </Link>
                    ))}
                  {!notes && (
                    <p className="no-notes">
                      You have not any notes yet, click on plus button and you
                      can start make new one.
                    </p>
                  )}
                </div>
              </motion.div>
              {/* notes end */}

              {/* chat */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="small-b box"
              >
                <div className="title">
                  <Message className="titles-icon" />
                  <h3>Unread messages</h3>
                  <Link className="create-icon" to="/chat">
                    <ArrowForwardRounded />
                  </Link>
                </div>

                <div className="unseen-wrp">
                  {friends &&
                    !loading &&
                    allFriends &&
                    !newMessage &&
                    allFriends
                      .filter((a) => {
                        return a.saw === false;
                      })
                      .map((f) => (
                        <Link to="/chat">
                          <UnSeen users={allUsers} user={f} />
                        </Link>
                      ))}
                  {allFriends &&
                    allFriends.filter((a) => {
                      return a.saw === false;
                    }).length === 0 && (
                      <p className="no-new-messages">
                        You have not any new messages. You had everything read.
                      </p>
                    )}
                </div>
              </motion.div>
              {/* chat end */}

              {/* SCHOOLEPAI */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="small-b box"
              >
                <Link className="link-to-ai" to={"/schoolepai"}>
                  <div className="schoolep_wrp">
                    <img className="bot" src={bot} />
                    <h3>SchoolepAI your helper to get knowledges.</h3>
                  </div>
                </Link>
              </motion.div>
              {/* SCHOOLEPAI end */}
            </div>
          </div>

          {/* PROFILE */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="big-b box profile-right"
          >
            {user && (
              <div className="profile">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="titles"
                >
                  <img alt="profile" src={user.profilePic} />
                  <h3 className="email">{user.email}</h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="moods"
                >
                  <h3>What is your mood ?</h3>
                  <p>Select emoji and express your feelings</p>
                  <div className="mood-wrapper">
                    <span
                      onClick={() => {
                        handleChangeMood("🥰");
                      }}
                      className={user.mood === "🥰" ? "active" : null}
                    >
                      🥰
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("😂");
                      }}
                      className={user.mood === "😂" ? "active" : null}
                    >
                      😂
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("🙂");
                      }}
                      className={user.mood === "🙂" ? "active" : null}
                    >
                      🙂
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("😔");
                      }}
                      className={user.mood === "😔" ? "active" : null}
                    >
                      😔
                    </span>
                    <span
                      onClick={() => {
                        handleChangeMood("😤");
                      }}
                      className={user.mood === "😤" ? "active" : null}
                    >
                      😤
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="bio"
                >
                  <h3>
                    Share your thoughts{" "}
                    <span style={{ fontSize: "8px", marginLeft: "10px" }}>
                      {bioLength}/{maxBio}
                    </span>
                  </h3>
                  <p>Your thoughts will see only friends.</p>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write some thoughts..."
                  />
                  <button
                    disabled={bioLength <= maxBio ? false : true}
                    onClick={handleUpdateBio}
                  >
                    {loadingSave ? <div className="loader-b"></div> : "Save"}
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
          {/* PROFILE end */}
        </div>
      </div>
    </>
  );
};

export default Home;

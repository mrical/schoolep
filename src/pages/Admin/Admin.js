import React, { useState, useEffect } from "react";
import "./Admin.css";
import { db } from "../../firebase";

import { Close, Search } from "@mui/icons-material";

import { motion } from "framer-motion";

import User from "../../components/User/User";
import useFetchUsers from "../../utilis/getUsers";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const Admin = () => {
  const [sureBlock, setSureBlock] = useState();
  const [sureBan, setSureBan] = useState();

  const [desDown, setDesDown] = useState();
  const [messageDown, setMessageDown] = useState();

  const [infoUser, setInfoUser] = useState();
  const [dataInfoUser, setDataInfoUser] = useState();

  const [searchFriend, setSearchFriend] = useState("");

  const [allUsers, setAllUsers] = useState();
  const [users, setUsers] = useState();

  const [showShutDown, setShowShutDown] = useState(false);

  const [loading, setLoading] = useState(true);

  const [shutDownInfo, setShutDownInfo] = useState();

  //fetch users
  useFetchUsers(setUsers);

  const getShutDown = () => {
    const starCountRef = collection(db, `shutdown/`);
    onSnapshot(starCountRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setShutDownInfo(data);
      }
    });
  };

  useEffect(() => {
    let array = [];

    for (let i in users) {
      array.push(users[i]);
      setAllUsers(array);
    }
    if (array.length === 0) {
      setAllUsers(array);
    }
  }, [users]);

  useEffect(() => {
    getShutDown();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [showVerify, setShowVerify] = useState(false);
  const [showNotVerify, setShowNotVerify] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showBaned, setShowBaned] = useState(false);

  const handleShowNotVerify = () => {
    setShowVerify(false);
    setShowNotVerify(true);
    setShowBlocked(false);
    setShowBaned(false);
  };
  const handleShowVerify = () => {
    setShowVerify(true);
    setShowNotVerify(false);
    setShowBlocked(false);
    setShowBaned(false);
  };
  const handleShowBlocked = () => {
    setShowVerify(false);
    setShowNotVerify(false);
    setShowBlocked(true);
    setShowBaned(false);
  };
  const handleShowBaned = () => {
    setShowVerify(false);
    setShowNotVerify(false);
    setShowBlocked(false);
    setShowBaned(true);
  };

  const handleShowAll = () => {
    setShowVerify(false);
    setShowNotVerify(false);
    setShowBlocked(false);
    setShowBaned(false);
  };

  const handleBanUser = (id) => {
    updateDoc(doc(db, "users/" + id), {
      ban: true,
      banTime: new Date().valueOf() + 86400000,
    });
    setSureBan(null);
  };

  const handleBlockedUser = async (id) => {
    updateDoc(doc(db, "users/" + id), {
      block: true,
    });
    setSureBlock(null);
  };

  useEffect(() => {
    if (infoUser) {
      const starCountRef = doc(db, `users/` + infoUser);
      onSnapshot(starCountRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setDataInfoUser(data);
        }
      });
    }
  }, [infoUser]);

  //loading admin menu mobile hide
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    document.getElementById("menu").classList.remove("left-menu");
    document.body.style.overflow = "visible";
  }, []);

  const handleShutDown = () => {
    if (messageDown && desDown) {
      setDoc(collection(db, "shutdown/"), {
        down: true,
        message: messageDown,
        description: desDown,
      });
    } else {
      alert("write message of shut down and description");
    }

    setDesDown(null);
    setMessageDown(null);
    setShowShutDown(false);
  };
  const handleUnShutDown = () => {
    deleteDoc(collection(db, "shutdown/"));
  };

  return (
    <>
      <div id="admin">
        {!loading && users && allUsers && (
          <div className="wrapper-admin">
            <div className="all_users">
              <div className="titles">
                <div className="wrp-tit-sear">
                  <h2>
                    All users{" "}
                    <span style={{ fontSize: ".7rem" }}>
                      ({allUsers.length})
                    </span>
                  </h2>
                  <div className="search-input">
                    <Search />
                    <input
                      value={searchFriend}
                      onChange={(e) => setSearchFriend(e.target.value)}
                      placeholder="Search friends..."
                    />
                  </div>
                  {shutDownInfo ? (
                    <button
                      style={{ background: "#ff0022" }}
                      onClick={() => handleUnShutDown(true)}
                    >
                      ShutDown off
                    </button>
                  ) : (
                    <button onClick={() => setShowShutDown(true)}>
                      shutdown
                    </button>
                  )}
                </div>
                <div className="filter">
                  <a
                    onClick={handleShowAll}
                    className={
                      !showNotVerify &&
                      !showVerify &&
                      !showBaned &&
                      !showBlocked
                        ? "active"
                        : null
                    }
                  >
                    All
                  </a>
                  <a
                    onClick={handleShowVerify}
                    className={showVerify ? "active" : null}
                  >
                    Verify
                  </a>
                  <a
                    onClick={handleShowNotVerify}
                    className={showNotVerify ? "active" : null}
                  >
                    Not verify
                  </a>
                  <a
                    onClick={handleShowBaned}
                    className={showBaned ? "active" : null}
                  >
                    Baned
                  </a>
                  <a
                    onClick={handleShowBlocked}
                    className={showBlocked ? "active" : null}
                  >
                    Blocked
                  </a>
                </div>
              </div>
              <div className="content-users">
                <div className="scrool-users">
                  {!showNotVerify &&
                    !showVerify &&
                    !showBaned &&
                    !showBlocked &&
                    searchFriend.length < 1 &&
                    allUsers
                      .sort((a, b) => {
                        return b.timestamp - a.timestamp;
                      })
                      .map((u, i) => (
                        <User
                          key={i}
                          {...u}
                          setSureBlock={setSureBlock}
                          setSureBan={setSureBan}
                          setInfoUser={setInfoUser}
                        />
                      ))}

                  {!showNotVerify &&
                    !showVerify &&
                    !showBaned &&
                    !showBlocked &&
                    allUsers && (
                      <div>
                        {searchFriend.length > 1 &&
                          allUsers
                            .filter((user) => {
                              const name = user.name
                                .toLowerCase()
                                .includes(searchFriend.toLowerCase());
                              return name;
                            })
                            .map((u, i) => (
                              <User
                                key={i}
                                {...u}
                                setSureBlock={setSureBlock}
                                setSureBan={setSureBan}
                                setInfoUser={setInfoUser}
                              />
                            ))}
                      </div>
                    )}

                  {showVerify &&
                    allUsers
                      .filter((a) => {
                        return a.verify;
                      })
                      .map((u, i) => (
                        <User
                          key={i}
                          {...u}
                          setSureBlock={setSureBlock}
                          setSureBan={setSureBan}
                          setInfoUser={setInfoUser}
                        />
                      ))}
                  {showNotVerify &&
                    allUsers
                      .filter((a) => {
                        return !a.verify;
                      })
                      .map((u, i) => (
                        <User
                          key={i}
                          {...u}
                          setSureBlock={setSureBlock}
                          setSureBan={setSureBan}
                          setInfoUser={setInfoUser}
                        />
                      ))}
                  {showBaned &&
                    allUsers
                      .filter((a) => {
                        return a.ban;
                      })
                      .map((u, i) => (
                        <User
                          key={i}
                          {...u}
                          setSureBlock={setSureBlock}
                          setSureBan={setSureBan}
                          setInfoUser={setInfoUser}
                        />
                      ))}
                  {showBlocked &&
                    allUsers
                      .filter((a) => {
                        return a.block;
                      })
                      .map((u, i) => (
                        <User
                          key={i}
                          {...u}
                          setSureBlock={setSureBlock}
                          setSureBan={setSureBan}
                          setInfoUser={setInfoUser}
                        />
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {sureBlock && (
        <div className="sure">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="wrp"
          >
            <h2>Block acocunt</h2>
            <p>Are you sure you want block account</p>
            <p style={{ fontStyle: "italic", textDecoration: "underline" }}>
              {sureBlock[1]}
            </p>
            <button onClick={() => handleBlockedUser(sureBlock[0])}>
              Block
            </button>
            <Close className="close" onClick={() => setSureBlock(null)} />
          </motion.div>
        </div>
      )}
      {sureBan && (
        <div className="sure">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="wrp"
          >
            <h2>Ban acocunt</h2>
            <p>Are you sure you want ban account</p>
            <p style={{ fontStyle: "italic", textDecoration: "underline" }}>
              {sureBan[1]}
            </p>
            <button onClick={() => handleBanUser(sureBan[0])}>Ban</button>
            <Close className="close" onClick={() => setSureBan(null)} />
          </motion.div>
        </div>
      )}

      {infoUser && dataInfoUser && (
        <div className="sure">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="wrp-info"
          >
            <label>
              name: <h3>{dataInfoUser.name}</h3>
            </label>
            <label>
              email: <h3>{dataInfoUser.email}</h3>
            </label>
            <p>bio: {dataInfoUser.bio ? dataInfoUser.bio : "no bio"}</p>
            <p>mood: {dataInfoUser.mood}</p>
            <p className={dataInfoUser.verify ? "verify ver" : "notverify ver"}>
              {dataInfoUser.verify ? "Verify" : "Not verify"}
            </p>
            <p className="last">
              Last login: {new Date(dataInfoUser.lastLogin).toLocaleString()}
            </p>
            <Close
              className="close"
              onClick={() => {
                setDataInfoUser(null);
                setInfoUser(null);
              }}
            />
          </motion.div>
        </div>
      )}
      {showShutDown && (
        <div className="sure">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="wrp-down"
          >
            <h3>Shut Down</h3>
            <p>All users can not using web until you turn it off</p>
            <input
              onChange={(e) => setMessageDown(e.target.value)}
              placeholder="Message of shutdown"
            />
            <input
              onChange={(e) => setDesDown(e.target.value)}
              placeholder="description of shutdown"
            />
            <button onClick={() => handleShutDown()}>Shutdown</button>
            <Close className="close" onClick={() => setShowShutDown(null)} />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Admin;

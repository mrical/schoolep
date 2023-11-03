import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Loading from "./components/Loading/Loading";
import "./App.css";
import logo from "./assets/logo_white.png";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SettingsIcon from "@mui/icons-material/Settings";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  AdminPanelSettings,
  ArrowBack,
  AutoAwesomeMotion,
  Logout,
} from "@mui/icons-material";
import { db, rdb } from "./firebase";
import { useAuth } from "./context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import usePremiumStatus from "./hooks/usePremiumStatus";

import { motion } from "framer-motion";
import { onSnapshot, updateDoc, doc, collection } from "firebase/firestore";
import { Alert, Snackbar } from "@mui/material";

const App = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(true);

  let location = useLocation();
  let path = location.pathname;

  const [clickedVerify, setClickVerify] = useState(false);

  const { currentUser, logout, sendEmailVerify } = useAuth();

  const [loadingBtn, setLoadingBtn] = useState(false);

  const [seconds, setSeconds] = useState(60);

  const [shutDownInfo, setShutDownInfo] = useState();

  const currentPlan = usePremiumStatus(user);

  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: "top",
    horizontal: "right",
    limit: 10,
  });
  const getShutDown = () => {
    const starCountRef = collection(db, `shutdown/`);
    onSnapshot(starCountRef, (docSnapshot) => {
      const data = docSnapshot.docs.map((doc) => doc.data());
      setShutDownInfo(data[0]);
    });
  };

  // logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  // get info about user
  const getUser = () => {
    const starCountRef = doc(db, `users/${currentUser.uid}`);
    onSnapshot(starCountRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setUser(data);
        if (!data.admin) {
          getShutDown();
        }
      }
    });
  };

  useEffect(() => {
    //change title
    setTimeout(() => {
      setLoading(false);
      document.title = "Schoolep";
    }, 1000);
    try {
      getUser();
      updateDoc(doc(db, "users/" + currentUser.uid), {
        verify: currentUser.emailVerified,
      });
    } catch (error) {
      console.log("user snapshot", error);
    }
  }, []);

  //handle send verification to your email
  const handleSendVerify = async () => {
    setLoadingBtn(true);
    try {
      await sendEmailVerify(currentUser.uid);
      setLoadingBtn(false);
      setClickVerify(true);
    } catch (err) {
      console.log(err);
      setLoadingBtn(false);
    }
  };

  //if you clicked on send verivifaction again you wait one minute - animation timer
  useEffect(() => {
    if (clickedVerify) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            clearInterval(interval);
            setClickVerify(false);
            setSeconds(60);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      // Clear interval when component unmounts
      return () => clearInterval(interval);
    }
  }, [clickedVerify]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  //If you got banned and current time is biger than your ban you got unban
  useEffect(() => {
    if (currentUser && user) {
      if (new Date().valueOf() > user.banTime) {
        updateDoc(doc(db, "users/" + currentUser.uid), {
          ban: false,
          banTime: null,
        });
      }
    }
  }, [user]);
  useEffect(() => {
    if (
      !currentPlan.loading &&
      currentPlan.requestLimit - user.userChatRequestCount <
        parseInt(process.env.REACT_APP_POPUP_LIMIT)
    ) {
      setSnackbar((snackbar) => ({
        ...snackbar,
        open: true,
        limit: currentPlan.requestLimit - user.userChatRequestCount,
      }));
    }
  }, [currentPlan]);
  return (
    <>
      <>{}</>

      {!loading &&
        currentUser.emailVerified &&
        !user.ban &&
        !user.block &&
        !shutDownInfo && (
          <div id="main">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="navbar left-side "
              id="menu"
            >
              <div className="wrapper-navbar">
                <ArrowBack
                  onClick={() => {
                    document
                      .getElementById("menu")
                      .classList.remove("left-menu");
                    document.body.style.overflow = "visible";
                  }}
                  className="arrow-back-mobile"
                />
                <nav>
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ rotate: 180, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    src={logo}
                    alt="logo"
                  />
                  <ul>
                    <Link to="/" className={path === "/" ? "active" : null}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="ul-icon"
                      >
                        <HomeIcon />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Home
                      </motion.p>
                    </Link>
                    <Link
                      to="/chat"
                      className={path === "/chat" ? "active" : null}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="ul-icon"
                      >
                        <ChatIcon />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Chat
                      </motion.p>
                    </Link>
                    <Link
                      to="/notes"
                      className={path.includes("notes") ? "active" : null}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="ul-icon"
                      >
                        <AutoAwesomeMotion />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        Notes
                      </motion.p>
                    </Link>
                    <Link
                      to="/schoolepai"
                      className={path === "/schoolepai" ? "active" : null}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="ul-icon"
                      >
                        <SmartToyIcon />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        SchoolepAI
                      </motion.p>
                    </Link>
                    <Link
                      to="/settings"
                      className={path === "/settings" ? "active" : null}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="ul-icon"
                      >
                        <SettingsIcon />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        Settings
                      </motion.p>
                    </Link>
                    <Link
                      to="/pricing"
                      className={path === "/pricing" ? "active" : null}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="ul-icon"
                      >
                        <PaymentIcon />
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        Pricing
                      </motion.p>
                    </Link>
                    {user.admin ? (
                      <Link
                        to="/admin"
                        className={path === "/admin" ? "active" : null}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                          className="ul-icon"
                        >
                          <AdminPanelSettings />
                        </motion.div>
                        <motion.p
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          Admin
                        </motion.p>
                      </Link>
                    ) : null}
                  </ul>
                </nav>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="logout"
                  onClick={handleLogout}
                >
                  <Logout className="icon" />
                  <h4>Logout</h4>
                </motion.div>
              </div>
            </motion.div>

            <div className="right-side">
              <div className="mobile_top_bar">
                {user && (
                  <div className="profile">
                    <img src={user.profilePic} />
                    <h3>{user.name}</h3>
                  </div>
                )}
                <MenuIcon
                  onClick={() => {
                    document.getElementById("menu").classList.add("left-menu");
                    document.body.style.overflow = "hidden";
                  }}
                  className="menu-bar-icon"
                />
              </div>
              <div id="children">{children}</div>
              <Snackbar
                anchorOrigin={{
                  vertical: snackbar.vertical,
                  horizontal: snackbar.horizontal,
                }}
                open={snackbar.open}
                key={snackbar.vertical + snackbar.horizontal}
                color="#FF7A00"
              >
                <Alert
                  onClose={() => {
                    setSnackbar((snackbar) => ({ ...snackbar, open: false }));
                  }}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {`You have ${
                    snackbar.limit || "No"
                  } AI chat requests left upgrade your plan`}
                </Alert>
              </Snackbar>
            </div>
          </div>
        )}
      {!loading && !currentUser.emailVerified && !user.ban && !shutDownInfo && (
        <div id="verify">
          <div className="wrp">
            <h2>Email verification required</h2>
            <p>
              Welcome in <span className="primary-color">Schoolep !</span>{" "}
              Secure your account{" "}
              <span className="emil">{currentUser.email}</span> and unlock full
              access. To ensure the utmost security and provide you with a
              seamless experience, we require email verification for all users.
              Verifying your email address is a quick and essential step to
              safeguard your account and access all the features and benefits
              our platform has to offer.
            </p>
            <div className="btn-wrp">
              {clickedVerify ? (
                <button disabled={clickedVerify}>{formatTime(seconds)}</button>
              ) : (
                <button onClick={() => handleSendVerify()}>
                  {loadingBtn ? (
                    <div className="btn-loader"></div>
                  ) : (
                    "Send verification agian"
                  )}
                </button>
              )}
              <button className="lgt" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && <Loading />}
      {!loading && user.ban && !user.block && !shutDownInfo && (
        <div id="banned">
          <div className="wrp">
            <h2>You got banned</h2>
            <p>
              Admin of <span className="primary-color">Schoolep</span> banned
              your account. If you dont agree with banned, try contact our team{" "}
              <a href="mailto:schoolep.team@gmail.com">Schoolep</a>. You will be
              unban at:{" "}
            </p>
            <h3>{new Date(user.banTime).toLocaleString()}</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
      {!loading && user.ban && user.block && !shutDownInfo && (
        <div id="banned">
          <div className="wrp">
            <h2>Blocked</h2>
            <p>
              Admin of <span className="primary-color">Schoolep</span> blocked
              your account. If you dont agree with block, try contact our team{" "}
              <a href="mailto:schoolep.team@gmail.com">Schoolep</a>. Block can
              be permanent:{" "}
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
      {!loading && !user.ban && user.block && !shutDownInfo && (
        <div id="banned">
          <div className="wrp">
            <h2>Blocked</h2>
            <p>
              Admin of <span className="primary-color">Schoolep</span> blocked
              your account. If you dont agree with block, try contact our team{" "}
              <a href="mailto:schoolep.team@gmail.com">Schoolep</a>. Block can
              be permanent:{" "}
            </p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}

      {shutDownInfo && (
        <div id="banned">
          <div className="wrp">
            <h2>{shutDownInfo.message}</h2>
            <p>{shutDownInfo.description}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

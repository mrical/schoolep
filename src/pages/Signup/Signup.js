import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/auth.css";

import logo from "../../assets/logo.png";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";

import { motion } from "framer-motion";

import ReCAPTCHA from "react-google-recaptcha";
import LeftSide from "../../components/LeftSide/LeftSide";
import Tos from "../../components/Tos/Tos";
import Policy from "../../components/Policy/Policy";
import {
  Container,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const Signup = () => {
  const { signup } = useAuth();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordCon, setVisiblePasswordCon] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConRef = useRef();

  const [human, setHuman] = useState(false);
  const [showCatch, setShowCatch] = useState(false);
  //change title
  useEffect(() => {
    document.title = "Schoolep - sign up";
  }, []);

  //create account
  const handleSignup = async () => {
    if (
      emailRef.current.value < 1 &&
      passwordRef.current.value < 1 &&
      passwordConRef.current.value < 1 &&
      nameRef.current.value < 1
    ) {
      setError("Fill the all fields! And create your account");
    } else {
      try {
        if (human) {
          if (
            passwordConRef.current.value === passwordRef.current.value &&
            passwordRef.current.value.length > 5
          ) {
            if (nameRef.current.value.length < 19) {
              setLoading(true);
              await signup(
                emailRef.current.value,
                passwordRef.current.value,
                nameRef.current.value
              )
                .then(() =>
                  setTimeout(() => {
                    navigate("/");
                  }, 1000)
                )
                .catch((err) => console.log(err));
            } else {
              setError("Name length is too long, only 18 characters.");
            }
          } else if (passwordRef.current.value.length < 5) {
            setError("Password have to contains more than 6 characters");
          } else {
            document
              .querySelector(".password .psw-icon")
              .classList.add("ani-icon");
            document
              .querySelector(".password-c .psw-icon")
              .classList.add("ani-icon");
            setError(
              "The password does not match the confirmation password, please check carefully and try again"
            );
            setTimeout(() => {
              document
                .querySelector(".password .psw-icon")
                .classList.remove("ani-icon");
              document
                .querySelector(".password-c .psw-icon")
                .classList.remove("ani-icon");
            }, 500);
          }
        } else {
          setError("Check box to verify that you are human");
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
        switch (err.code) {
          case "auth/email-already-in-use":
            setError(
              "The email is already being used by someone else. Please check your email and try again"
            );
            break;
        }
      }
    }

    setTimeout(() => {
      setError("");
    }, 5000);
  };

  function onChange(value) {
    if (value) {
      setHuman(true);
    }
  }

  const checkingFields = () => {
    if (
      emailRef.current.value.length > 0 &&
      passwordRef.current.value.length > 0 &&
      passwordConRef.current.value.length > 0 &&
      nameRef.current.value.length > 0
    ) {
      setShowCatch(true);
    } else {
      setShowCatch(false);
      setHuman(false);
    }
  };

  return (
    <div id="auth">
      <div className="wrapper">
        <LeftSide />
        <div className="right-side">
          <div className="content">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ rotate: 180, scale: 1 }}
              transition={{ delay: 0.2 }}
              src={logo}
              className="auth-logo logo"
            />
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="auth-title"
            >
              Sign up
            </motion.h2>
            {error && (
              <motion.p
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.1 }}
                className="auth-subtitle"
              >
                {error}
              </motion.p>
            )}
            {!error && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="auth-subtitle"
              >
                By creating account on{" "}
                <span className="primary-color">schoolep</span> you can connect
                conversation with your friends.
              </motion.p>
            )}
            <div className="inputs">
              <div className="ema-usr">
                <motion.input
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                  onChange={() => {
                    checkingFields();
                  }}
                />
                <motion.input
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  ref={nameRef}
                  type="text"
                  placeholder="Name"
                  onChange={() => {
                    checkingFields();
                  }}
                />
              </div>
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="password"
              >
                <input
                  ref={passwordRef}
                  type={!visiblePassword ? "password" : "text"}
                  onChange={() => {
                    checkingFields();
                  }}
                  placeholder="Password"
                />
                {visiblePassword && (
                  <VisibilityIcon
                    onClick={() => setVisiblePassword(false)}
                    className="psw-icon"
                  />
                )}
                {!visiblePassword && (
                  <VisibilityOffIcon
                    onClick={() => setVisiblePassword(true)}
                    className="psw-icon"
                  />
                )}
              </motion.div>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="password-c"
              >
                <input
                  ref={passwordConRef}
                  type={!visiblePasswordCon ? "password" : "text"}
                  onChange={() => {
                    checkingFields();
                  }}
                  placeholder="Password Confirm"
                />
                {visiblePasswordCon && (
                  <VisibilityIcon
                    onClick={() => setVisiblePasswordCon(false)}
                    className="psw-icon"
                  />
                )}
                {!visiblePasswordCon && (
                  <VisibilityOffIcon
                    onClick={() => setVisiblePasswordCon(true)}
                    className="psw-icon"
                  />
                )}
              </motion.div>
            </div>
            {showCatch && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <ReCAPTCHA
                  sitekey="6LeNfy0oAAAAAIRkXixRzm7pOrujbHbpElj-UVsI"
                  onChange={onChange}
                />
              </motion.div>
            )}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="auth-btn"
              disabled={loading}
              onClick={handleSignup}
            >
              {!loading ? "Sign up" : <div className="loader"></div>}
            </motion.button>
            <motion.a
              initial={{ x: -1, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="auth-question"
            >
              Do you already have account ?{" "}
              <Link className="primary-color" to="/login">
                Login
              </Link>
            </motion.a>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "15px",
              }}
            >
              <Tos />
              <Policy />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

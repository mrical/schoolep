import React, { useEffect, useState } from "react";
import "./SchoolepAI.css";
import bot from "../../assets/bot.svg";
import {
  HourglassBottom,
  Replay,
  Save,
  Send,
  ContentCopy,
} from "@mui/icons-material";

import { motion } from "framer-motion";
import { auth } from "../../firebase";

const SchoolepAI = () => {
  const [message, setMessage] = useState();
  const [response, setResponse] = useState();
  const [responseText, setResponseText] = useState();
  const [sendMessage, setSendMessage] = useState(false);
  const [userIdToken, setUserIdToken] = useState(false);

  //getting response
  const handleSubmit = (e) => {
    document.getElementById("bot").classList.add("up_down");

    setSendMessage(true);

    //paste here your own url from your own server
    //how to do it is in documentation.docx
    //cyclic.app
    console.log(process.env.AICHAT_END_POINT);
    fetch(process.env.AICHAT_END_POINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${userIdToken}`,
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message));
  };

  //text animation
  const showTextLetterByLetter = (text, speed) => {
    let i = 0;
    let output = document.getElementById("response");
    let timer = setInterval(function () {
      if (i < text.length) {
        output.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };

  useEffect(() => {
    if (response) {
      showTextLetterByLetter(response, 50);
    }
  }, [response]);

  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu");
    document.body.style.overflow = "visible";
    (async () => {
      const userIdToken = await auth.currentUser?.getIdToken(true);
      setUserIdToken(userIdToken);
    })();
  }, []);

  return (
    <>
      <div id="schoolep-ai">
        <div className="choose-section">
          <div className="titles">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Schoolep AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              SchoolepAI helps you with almost everything. Ask him on
              everything, facts, definitions, basic questions and other...
            </motion.p>
          </div>
          <div className="response-content">
            {response && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                  }}
                  id="response"
                  className="response"
                >
                  <span> {responseText}</span>
                  <ContentCopy
                    fontSize="small"
                    className="icon"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigator.clipboard.writeText(response)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="input-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="input-message"
            >
              <input
                value={message}
                disabled={sendMessage ? true : false}
                placeholder="Ask me..."
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="icons">
                {response && (
                  <Replay
                    className="icon"
                    onClick={() => {
                      setResponse();
                      setResponseText();
                      setMessage("");
                      setSendMessage(false);
                    }}
                  />
                )}
                {!sendMessage && (
                  <Send className="icon" onClick={handleSubmit} />
                )}
                {sendMessage && !response && (
                  <HourglassBottom className="icon" />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {!response && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            src={bot}
            alt="bot"
            id="bot"
            className="bot-ai"
          />
        )}
      </div>
    </>
  );
};

export default SchoolepAI;

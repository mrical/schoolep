import React from "react";

import { ref, update } from "firebase/database";
import { db, rdb } from "../../firebase";

import { BiBlock, BiTimeFive } from "react-icons/bi";
import { LuTimerOff } from "react-icons/lu";
import { AiFillInfoCircle } from "react-icons/ai";
import { CgUnblock } from "react-icons/cg";

import "./User.css";
import { doc, updateDoc } from "firebase/firestore";

const User = ({
  name,
  email,
  lastLogin,
  ban,
  block,
  mood,
  bio,
  verify,
  id,
  setSureBlock,
  setSureBan,
  admin,
  setInfoUser,
}) => {
  const handleBlockedUser = async (id, email) => {
    setSureBlock([id, email]);
  };

  const handleUnBanUser = (id) => {
    // update(ref(rdb, 'users/' + id), {
    //   ban: false,
    //   banTime: null
    // });
    updateDoc(doc(db, "users/" + id), {
      ban: false,
      banTime: null,
    });
  };

  const handleBanUser = async (id, email) => {
    setSureBan([id, email]);
  };

  const handleUnBlockedUser = async (id) => {
    // update(ref(rdb, 'users/' + id), {
    //   block: false,
    // });
    updateDoc(doc(db, "users/" + id), {
      block: false,
    });
  };

  return (
    <div id="user">
      <div className="wrp">
        <div className="content">
          <div className="wrp-who">
            <h3>{name}</h3>
            <p className="email">{email}</p>
          </div>
          <div className="wrp-p">
            <p className={verify ? "verify ver" : "notverify ver"}>
              {verify ? "Verify" : "Not verify"}
            </p>
            <p className="last">
              Last login: {new Date(lastLogin).toLocaleString()}
            </p>
          </div>
        </div>
        {!admin && (
          <div className="wrp-btn">
            {block ? (
              <CgUnblock
                className="icon-r"
                onClick={() => handleUnBlockedUser(id)}
              />
            ) : (
              <BiBlock
                className="icon"
                onClick={() => handleBlockedUser(id, email)}
              />
            )}
            {ban ? (
              <LuTimerOff
                className="icon-r"
                onClick={() => handleUnBanUser(id)}
              />
            ) : (
              <BiTimeFive
                className="icon"
                onClick={() => handleBanUser(id, email)}
              />
            )}
            <AiFillInfoCircle
              className="icon"
              onClick={() => setInfoUser(id)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default User;

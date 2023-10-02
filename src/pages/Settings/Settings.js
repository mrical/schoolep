import { Add, Check, Edit } from "@mui/icons-material";
import { onValue, ref, update } from "firebase/database";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as set } from "firebase/storage";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { db, sdb } from "../../firebase";
import "./Settings.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";
import useFetchUserData from "../../utilis/getUser";
import { doc, updateDoc } from "firebase/firestore";

const Settings = () => {
  const [user, setUser] = useState();
  const [name, setName] = useState();

  const [editName, setEditName] = useState(false);

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visiblePasswordCon, setVisiblePasswordCon] = useState(false);

  const { currentUser, updateUserPassword } = useAuth();

  const [fileImg, setFileImg] = useState();
  const [filImg, setFilImg] = useState();

  const navigation = useNavigate();

  const passwordRef = useRef();
  const passwordConRef = useRef();

  //fetch user
  useFetchUserData(currentUser, setUser, null);

  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu");
  }, []);

  //open images files in pc
  const handlerUploadImg = () => {
    const fileSelector = document.querySelector(".file_input_img");
    var clickEvent = new MouseEvent("click", { bubbles: true });
    fileSelector.dispatchEvent(clickEvent);
  };

  /* Take pic to change profile pic*/
  const handlerChangeInputImg = (e) => {
    let fileImg = e.target.files[0];
    if (fileImg) {
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result;
        setFileImg(result);
      };
      reader.readAsDataURL(fileImg);
    }

    setFilImg(fileImg);
  };

  //all changes change in firebase
  const handleSave = async () => {
    if (fileImg) {
      const pathRef = set(
        sdb,
        "users/" + currentUser.uid + "/profile-picture/" + fileImg.name
      );

      uploadBytes(pathRef, filImg).then(() => {
        getDownloadURL(pathRef).then((url) => {
          updateDoc(doc(db, "users/" + currentUser.uid), {
            profilePic: url,
          });
        });
      });
    }

    if (name) {
      updateDoc(doc(db, "users/" + currentUser.uid), {
        name: name,
      });
    }

    if (
      passwordConRef.current.value.length > 5 &&
      passwordConRef.current.value === passwordRef.current.value
    ) {
      try {
        await updateUserPassword(passwordRef.current.value);
      } catch (err) {
        console.log(err.message);
      }
    } else if (
      passwordConRef.current.value.length > 5 &&
      passwordConRef.current.value !== passwordRef.current.value
    ) {
      alert("nove heslo sa nezhoduje s potvrdenim hesla !");
    }

    setFilImg(null);
    setFileImg(null);

    navigation("/");
  };

  return (
    <>
      {user && (
        <div id="settings">
          <input
            type="file"
            className="file_input_img"
            accept="image/png, image/gif, image/jpeg"
            onChange={handlerChangeInputImg}
          />
          <div className="wrapper-settings">
            <div className="content">
              <div onClick={handlerUploadImg} className="edit-image">
                <motion.img
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  src={fileImg || user.profilePic}
                  alt="profile pic"
                />
                <Add className="change-image-icon" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="edit-name"
              >
                <h2
                  contentEditable={editName ? true : false}
                  onKeyDown={(e) => {
                    if (e.which === 13) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => console.log(e)}
                  onKeyUp={(e) => {
                    setName(e.target.innerText);
                    console.log(e.target.innerText);
                  }}
                >
                  {user.name}
                </h2>
                {!editName && (
                  <Edit
                    className="edit-name"
                    onClick={() => setEditName(true)}
                  />
                )}
                {editName && (
                  <Check
                    className="edit-name"
                    onClick={() => setEditName(false)}
                  />
                )}
              </motion.div>
              <motion.h4
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {user.email}
              </motion.h4>
              <div className="change-password">
                <motion.h4
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Change password
                </motion.h4>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="password"
                >
                  <input
                    disabled={user.adminDemo ? true : false}
                    ref={passwordRef}
                    type={!visiblePassword ? "password" : "text"}
                    placeholder="New password"
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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="password-c"
                >
                  <input
                    disabled={user.adminDemo ? true : false}
                    ref={passwordConRef}
                    type={!visiblePasswordCon ? "password" : "text"}
                    placeholder="New password - confirm"
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
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                onClick={handleSave}
              >
                Save changes
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;

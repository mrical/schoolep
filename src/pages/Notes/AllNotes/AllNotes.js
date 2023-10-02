import {
  Add,
  AutoAwesomeMosaic,
  Folder,
  Note,
  Remove,
  TextSnippet,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import React, {  useState } from "react";
import { db,  } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";

import { motion } from "framer-motion";
import useFetchUserNotes from "../../../utilis/getNotes";
import useFetchUserFolders from "../../../utilis/getFolders";
import { addDoc, collection, } from "firebase/firestore";

const AllNotes = () => {
  const { currentUser } = useAuth();

  const [notes, setNotes] = useState();
  const [allNotes, setAllNotes] = useState();
  const [folders, setFolders] = useState();
  const [allFolders, setAllFolders] = useState();

  const [folderName, setFolderName] = useState("");

  const [createNewFolder, setCreateNewFolder] = useState(false);

  //fetch notes
  useFetchUserNotes(currentUser, setNotes, setAllNotes);

  //fetch folders
  useFetchUserFolders(currentUser, setFolders, setAllFolders);

  //pridat novy priecinok
  const handleAddFolder = () => {
    if (folderName.length > 2) {
      // const autoId = push(collection(db, 'notes/' + currentUser.uid + "/folders")).key

      addDoc(collection(db, "notes/" + currentUser.uid + "/folders/"), {
        folder_name: folderName,
        timestamp: new Date().valueOf(),
      });
      // setDoc(doc(db, 'notes/' + currentUser.uid + "/folders/" + autoId + "/"), {
      //     folder_name: folderName,
      //     timestamp: new Date().valueOf(),
      //     id: autoId
      //  });

      setFolderName("");
      setCreateNewFolder(false);
    }
  };

  return (
    <div className="content-notes">
      <div className="all-notes">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="titles"
        >
          <TextSnippet className="titles-icon" />
          <h3>All notes</h3>
          <Link className="create-icon" to="/notes/create">
            <Add />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="notes"
        >
          {allNotes &&
            allNotes.length > 0 &&
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
              You have not any notes yet, click on plus button and you can start
              make new one.
            </p>
          )}
        </motion.div>
      </div>
      <div className="all-fields">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="titles"
        >
          <AutoAwesomeMosaic className="titles-icon" />
          <h3>Folders</h3>
          {!createNewFolder && (
            <Add
              onClick={() => {
                setCreateNewFolder(!createNewFolder);
              }}
              className="create-folder"
            />
          )}
          {createNewFolder && (
            <Remove
              onClick={() => {
                setCreateNewFolder(!createNewFolder);
              }}
              className="create-folder"
            />
          )}
          {createNewFolder && (
            <div className="input-for-create-folder">
              <input
                className="input-for-folder"
                onChange={(e) => {
                  setFolderName(e.target.value);
                }}
                placeholder="Name of folder.."
              />
              <button onClick={handleAddFolder} className="add-folder">
                Add
              </button>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="folders"
        >
          {allFolders &&
            allFolders.length > 0 &&
            allFolders.map((n) => {
              console.log("note", n);
              return (
                <Link
                  className="folder-a"
                  to={"/notes/folder/" + currentUser.uid + "/" + n.id}
                >
                  <div className="folder" key={n.id}>
                    <Folder />
                    {n.folder_name && (
                      <h4>
                        {n.folder_name.length > 60
                          ? n.folder_name.substr(0, 50) + "..."
                          : n.folder_name}
                      </h4>
                    )}
                  </div>
                </Link>
              );
            })}
          {!folders && (
            <p className="no-notes">
              For better organization in notes add folders.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AllNotes;

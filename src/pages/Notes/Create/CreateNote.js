import { ArrowBack } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import { useAuth } from "../../../context/AuthContext";
import "quill/dist/quill.snow.css";
import {  push, ref} from "firebase/database";
import { db, rdb } from "../../../firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

const CreateNote = () => {
  const { currentUser } = useAuth();

  const navigation = useNavigate();

  const [noteName, setNoteName] = useState("");

  const [folders, setFolders] = useState();
  const [allFolders, setAllFolders] = useState();

  const [editorValue, setEditorValue] = useState();

  const [noteFolder, setNoteFolder] = useState("all");

  const { quill, quillRef } = useQuill();

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setEditorValue(quillRef.current.firstChild.innerHTML);
        console.log(quillRef.current.firstChild.innerHTML);
      });
    }
  }, [quill]);

  //dostat vsetky priecinky
  const getFolders = () => {
    const starCountRef = collection(db, `notes/${currentUser.uid}/folders/`);
    onSnapshot(starCountRef, (docSnapshot) => {
      const data = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFolders(data);
    });
  };

  const handleCreateNote = async () => {
    // const autoId = (await addDoc(collection(db, "noteIds"), {})).id;
    console.log("noteFolder", noteFolder);
    const autoId = push(ref(rdb, "notes")).key;
    if (noteName.length > 2 && noteFolder === "all") {
      setDoc(doc(db, "notes/" + currentUser.uid + "/all/" + autoId), {
        value: editorValue,
        id: autoId,
        timestamp: new Date().valueOf(),
        note_name: noteName,
        noteFolder: noteFolder,
      });

      navigation("/notes");
    } else if (noteName.length > 2 && noteFolder !== "all") {
      console.log("noteFolder", noteFolder);
      setDoc(doc(db, "notes/" + currentUser.uid + "/all/" + autoId), {
        value: editorValue,
        id: autoId,
        timestamp: new Date().valueOf(),
        note_name: noteName,
        noteFolder: noteFolder,
      });

      setDoc(
        doc(
          db,
          "notes/" +
            currentUser.uid +
            "/folders/" +
            noteFolder +
            "/notes/" +
            autoId
        ),
        {
          value: editorValue,
          id: autoId,
          noteFolder: noteFolder,
          timestamp: new Date().valueOf(),
          note_name: noteName,
        },
        (error) => {
          console.log("error in adding not to note folder", error);
        }
      );

      navigation("/notes");
    } else {
      alert("error");
    }
  };

  useEffect(() => {
    let array = [];
    console.log(folders);
    for (let i in folders) {
      array.push(folders[i]);
      setAllFolders(array);
    }
    if (array.length === 0) {
      setAllFolders(array);
    }
  }, [folders]);

  const handleNoteFolder = (e) => {
    console.log(e);
    console.dir(e.target);
    setNoteFolder(e.target.value);
  };

  return (
    <div className="content-editor-e">
      <div className="titles">
        <div className="back">
          <Link to="/notes">
            <ArrowBack />
          </Link>
        </div>
        <input
          className="note-name"
          placeholder="Name..."
          onChange={(e) => setNoteName(e.target.value)}
        />
        <select id="section-folder" onChange={handleNoteFolder}>
          <option value={"all"}>Not folder</option>
          {allFolders &&
            allFolders.map((f) => (
              <option value={f.id}>{f.folder_name}</option>
            ))}
        </select>
        <button className="save-edit" onClick={handleCreateNote}>
          Save
        </button>
      </div>
      <div className="editor">
        <div ref={quillRef} />
      </div>
    </div>
  );
};

export default CreateNote;

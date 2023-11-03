import { ArrowBack } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import { useAuth } from "../../../context/AuthContext";
import "quill/dist/quill.snow.css";
import { db } from "../../../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const Note = () => {
  const { currentUser } = useAuth();

  const navigation = useNavigate();

  const location = useLocation();

  let path = location.pathname;
  let path_id = path.toString().substring(41);

  const [note, setNote] = useState();
  const [noteName, setNoteName] = useState();

  const [folders, setFolders] = useState();
  const [allFolders, setAllFolders] = useState();

  const [editorValue, setEditorValue] = useState();

  const { quill, quillRef } = useQuill();

  const [noteFolder, setNoteFolder] = useState();

  useEffect(() => {
    if (quill && note) {
      if (editorValue) {
        quill.clipboard.dangerouslyPasteHTML(editorValue);
      }

      quill.on("text-change", () => {
        setEditorValue(quillRef.current.firstChild.innerHTML);
      });
    }
  }, [quill, editorValue]);

  const getNote = () => {
    const starCountRef = doc(db, `notes/${currentUser.uid}/all/${path_id}`);
    onSnapshot(starCountRef, (docSnapshot) => {
      if (!docSnapshot.exists()) return;
      const data = docSnapshot.data();
      setNote(data);
      setNoteFolder(data.noteFolder);
    });
  };

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

  useEffect(() => {
    getNote();
    getFolders();
  }, []);

  useEffect(() => {
    if (note) {
      setNoteName(note.note_name);
      setEditorValue(note.value);
    }
  }, [note]);

  useEffect(() => {
    let array = [];

    for (let i in folders) {
      array.push(folders[i]);
      setAllFolders(array);
    }
    if (array.length === 0) {
      setAllFolders(array);
    }
  }, [folders]);

  const handleNote = () => {
    if (noteName.length > 2) {

      if (note.noteFolder === "all") {
        updateDoc(doc(db, "notes/" + currentUser.uid + "/all/" + path_id), {
          value: editorValue,
          timestamp: new Date().valueOf(),
          note_name: noteName,
          id: path_id,
        });
      }

      if (note.noteFolder === "all" && noteFolder !== "all") {
        setDoc(
          doc(
            db,
            "notes/" +
              currentUser.uid +
              "/folders/" +
              noteFolder +
              "/notes/" +
              path_id
          ),
          {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          },
          (error) => {
            console.log(
              "Error in",
              "notes/" +
                currentUser.uid +
                "/folders/" +
                noteFolder +
                "/notes/" +
                path_id,
              error
            );
          }
        );
        updateDoc(doc(db, "notes/" + currentUser.uid + "/all/" + path_id), {
          value: editorValue,
          timestamp: new Date().valueOf(),
          note_name: noteName,
          noteFolder: noteFolder,
          id: path_id,
        });
      }

      if (note.noteFolder !== "all" && noteFolder === "all") {
        deleteDoc(
          doc(
            db,
            "notes/" +
              currentUser.uid +
              "/folders/" +
              note.noteFolder +
              "/notes/" +
              path_id
          )
        );

        updateDoc(doc(db, "notes/" + currentUser.uid + "/all/" + path_id), {
          value: editorValue,
          timestamp: new Date().valueOf(),
          note_name: noteName,
          noteFolder: noteFolder,
          id: path_id,
        });
      }

      if (note.noteFolder !== "all" && noteFolder !== "all") {
        deleteDoc(
          doc(
            db,
            "notes/" +
              currentUser.uid +
              "/folders/" +
              note.noteFolder +
              "/notes/" +
              path_id
          )
        );

        updateDoc(doc(db, "notes/" + currentUser.uid + "/all/" + path_id), {
          value: editorValue,
          timestamp: new Date().valueOf(),
          note_name: noteName,
          noteFolder: noteFolder,
          id: path_id,
        });
        setDoc(
          doc(
            db,
            "notes/" +
              currentUser.uid +
              "/folders/" +
              noteFolder +
              "/notes/" +
              path_id
          ),
          {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          }
        );
      }

      navigation("/notes");
    } else {
      alert("Error: no note name");
    }
  };

  const handleNoteFolder = (e) => {
    setNoteFolder(e.target.value);
  };

  const handleDelete = () => {
    if (note.noteFolder === "all") {
      deleteDoc(doc(db, "notes/" + currentUser.uid + "/all/" + path_id));
    } else {
      deleteDoc(doc(db, "notes/" + currentUser.uid + "/all/" + path_id));
      deleteDoc(
        doc(
          db,
          "notes/" +
            currentUser.uid +
            "/folders/" +
            noteFolder +
            "/notes/" +
            path_id
        )
      );
    }

    navigation("/notes");
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
          value={noteName}
          placeholder="Title..."
          onChange={(e) => setNoteName(e.target.value)}
        />
        <select id="section-folder" onChange={handleNoteFolder}>
          <option value={"all"}>No folder</option>
          {note &&
            allFolders &&
            allFolders.map((f) => (
              <option
                value={f.id}
                selected={note.noteFolder === f.id ? true : false}
              >
                {f.folder_name}
              </option>
            ))}
        </select>
        <button className="save-edit" onClick={handleNote}>
          Save
        </button>
        <button className="save-edit" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <div className="editor">
        <div ref={quillRef} />
      </div>
    </div>
  );
};

export default Note;

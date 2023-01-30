import { ArrowBack } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import { useAuth } from '../../../context/AuthContext'
import 'quill/dist/quill.snow.css';
import { onValue, push, ref, remove, set, update } from 'firebase/database';
import { rdb } from '../../../firebase';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';


const Note = () => {


    const { currentUser } = useAuth()

    const navigation = useNavigate()

    const location = useLocation()

    let path = location.pathname
    let path_id = path.toString().substring(41)
  
    
      
    const [note, setNote] = useState()
    const [noteName, setNoteName] = useState()

    const [folders, setFolders] = useState()
    const [allFolders, setAllFolders] = useState()


    
    const [editorValue, setEditorValue] = useState()
    
    const { quill, quillRef } = useQuill();


    const [noteFolder, setNoteFolder] = useState()

    useEffect(() => {
      if (quill && note) {
        quill.clipboard.dangerouslyPasteHTML(editorValue);
        
        quill.on("text-change", () => {
          setEditorValue(quillRef.current.firstChild.innerHTML)
          console.log(quillRef.current.firstChild.innerHTML)
        })

      }
    }, [quill])

    const getNote = () => {

      const starCountRef = ref(rdb, `notes/${currentUser.uid }/all/${path_id}`);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setNote(data);
        setNoteFolder(data.noteFolder)
      });

    }

    const getFolders = () => {

      const starCountRef = ref(rdb, `notes/${currentUser.uid}/folders/`);
      onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setFolders(data);
      });

  }
  

    useEffect(() => {
      getNote()
      getFolders()
    }, [])

    useEffect(() => {
      if(note) {
        setNoteName(note.note_name)
        setEditorValue(note.value)
      }
    }, [note])

    useEffect(() => {

      let array = []
          
       for(let i in folders) {
           array.push(folders[i])
           setAllFolders(array)
       }
       if(array.length === 0) {
           setAllFolders(array)
       }
  
    }, [folders])

    const handleNote = () => {

      if(noteName.length > 2) {
       console.log(note.noteFolder)
       console.log(noteFolder)


        if(note.noteFolder === "all") {
          update(ref(rdb, 'notes/' + currentUser.uid + "/all/" + path_id), {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            id: path_id,
          });
        }


        if(note.noteFolder === "all" && noteFolder !== "all") {
          set(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + noteFolder + "/notes/" + path_id), {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          });
          update(ref(rdb, 'notes/' + currentUser.uid + "/all/" + path_id), {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          });
        }

        if(note.noteFolder !== "all" && noteFolder === "all") {
          remove(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + note.noteFolder + "/notes/" + path_id));
          
          update(ref(rdb, 'notes/' + currentUser.uid + "/all/" + path_id), {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          });
        }

        if(note.noteFolder !== "all" && noteFolder !== "all") {
          remove(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + note.noteFolder + "/notes/" + path_id));
          
          update(ref(rdb, 'notes/' + currentUser.uid + "/all/" + path_id), {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          });
          set(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + noteFolder + "/notes/" + path_id), {
            value: editorValue,
            timestamp: new Date().valueOf(),
            note_name: noteName,
            noteFolder: noteFolder,
            id: path_id,
          });
        }


        navigation("/notes")
      }else {
        alert("Error: no note name")
      }
       
    }

    const handleNoteFolder = (e) => {
      setNoteFolder(e.target.value)
    }

    const handleDelete = () => {
      
      if(note.noteFolder === "all") {
        remove(ref(rdb, 'notes/' + currentUser.uid + "/all/" + path_id))
      }else {
        remove(ref(rdb, 'notes/' + currentUser.uid + "/all/" + path_id))
        remove(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + noteFolder + "/notes/" + path_id))
      }

      navigation("/notes")

    }
    


  return (
        <div className='content-editor-e' >
          <div className='titles' >
            <div className='back' >
                <Link to="/notes">
                    <ArrowBack />
                </Link>
            </div>
            <input className='note-name' value={noteName} placeholder='Názov...' onChange={(e) => setNoteName(e.target.value)} />
            <select id="section-folder" onChange={handleNoteFolder} >
            <option value={"all"} >Žiaden priečinok</option>
            {note && allFolders && allFolders.map((f) => (
                <option value={f.id} selected={note.noteFolder === f.id ? true : false} >{f.folder_name}</option>
                ))}
            </select>
            <button className='save-edit' onClick={handleNote}  >Uložiť</button>
            <button className='save-edit' onClick={handleDelete}  >Vymazať</button>
          </div>
          <div className='editor'>
              <div ref={quillRef} />
          </div>
        </div> 
  )
}

export default Note
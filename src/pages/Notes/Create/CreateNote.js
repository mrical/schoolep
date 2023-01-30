import { ArrowBack } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import { useAuth } from '../../../context/AuthContext'
import 'quill/dist/quill.snow.css';
import { onValue, push, ref, set } from 'firebase/database';
import { rdb } from '../../../firebase';
import { Link, Navigate, useNavigate } from 'react-router-dom';


const CreateNote = () => {


    const { currentUser } = useAuth()

    const navigation = useNavigate()

    const [createNew, setCreateNew] = useState(false)
    const [noteName, setNoteName] = useState("")
    
    const [folders, setFolders] = useState()
    const [allFolders, setAllFolders] = useState()

    const [editorValue, setEditorValue] = useState()
    
    const [noteFolder, setNoteFolder] = useState("all")
    
    const { quill, quillRef } = useQuill();


    useEffect(() => {
        getFolders()
    }, [])

    useEffect(() => {
        if(quill) {
          quill.on("text-change", () => {
            setEditorValue(quillRef.current.firstChild.innerHTML)
            console.log(quillRef.current.firstChild.innerHTML)
          })
        }
    }, [quill])


    const getFolders = () => {

        const starCountRef = ref(rdb, `notes/${currentUser.uid}/folders/`);
        onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setFolders(data);
        });
  
    }

    const handleCreateNote = () => {
        const autoId = push(ref(rdb, "notes")).key

        if(noteName.length > 2 && noteFolder === "all") {
      
          set(ref(rdb, 'notes/' + currentUser.uid + "/all/" + autoId), {
             value: editorValue,
             id: autoId,
             timestamp: new Date().valueOf(),
             note_name: noteName,
             noteFolder: noteFolder,
          });
          
          navigation("/notes")

        }else if(noteName.length > 2 && noteFolder !== "all"){
           
            set(ref(rdb, 'notes/' + currentUser.uid + "/all/" + autoId), {
                value: editorValue,
                id: autoId,
                timestamp: new Date().valueOf(),
                note_name: noteName,
                noteFolder: noteFolder,
             });

            set(ref(rdb, 'notes/' + currentUser.uid + "/folders/" + noteFolder + "/notes/" + autoId), {
                value: editorValue,
                id: autoId,
                noteFolder: noteFolder,
                timestamp: new Date().valueOf(),
                note_name: noteName
             });

             navigation("/notes")
        }else {
            alert("error")
        }
    
      }


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
    
      const handleNoteFolder = (e) => {
        setNoteFolder(e.target.value)
      }

  return (
        <div className='content-editor-e' >
          <div className='titles' >
            <div className='back' >
                <Link to="/notes">
                    <ArrowBack />
                </Link>
            </div>
            <input className='note-name' placeholder='Názov...' onChange={(e) => setNoteName(e.target.value)} />
            <select id="section-folder" onChange={handleNoteFolder} >
                <option value={"all"} >Žiaden priečinok</option>
            {allFolders && allFolders.map((f) => (
                <option value={f.id} >{f.folder_name}</option>
                ))}
            </select>          
            <button className='save-edit' onClick={handleCreateNote}  >Uložiť</button>
          </div>
          <div className='editor'>
              <div ref={quillRef} />
          </div>
        </div> 
  )
}

export default CreateNote
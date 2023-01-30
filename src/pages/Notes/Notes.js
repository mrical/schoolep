import { Add, ArrowBack, AutoAwesomeMosaic, Note, PlusOne, PlusOneOutlined, Quickreply, TextSnippet } from '@mui/icons-material'
import React, { Children, useEffect, useState } from 'react'
import "./Notes.css"
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import { useAuth } from '../../context/AuthContext';
import { push, ref, set } from 'firebase/database';
import { rdb } from '../../firebase';

const Notes = ({children}) => {

  const { currentUser } = useAuth()

  const [createNew, setCreateNew] = useState(false)
  const [noteName, setNoteName] = useState("")
  
  const [editorValue, setEditorValue] = useState()
  
  const { quill, quillRef } = useQuill();
  
  
  useEffect(() => {
      if(quill) {
        quill.on("text-change", () => {
          setEditorValue(quillRef.current.firstChild.innerHTML)
          console.log(quillRef.current.firstChild.innerHTML)
        })
      }
  }, [quill])








  const handleCreateNote = () => {

    if(noteName.length > 2) {
      const autoId = push(ref(rdb, "notes")).key
  
      set(ref(rdb, 'notes/' + currentUser.uid + "/" + autoId), {
         value: editorValue,
         timestamp: new Date().valueOf(),
         note_name: noteName
      });
  
  
      setCreateNew(false)
      setNoteName("")
      setEditorValue()
      

    }else {
      alert("Error: no note name")
    }

  }


  return (
    <div id="notes" >
      <div className='wrapper-notes' >        
        
          {children}

      </div>
    </div>
  )
}

export default Notes
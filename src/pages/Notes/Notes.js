import React, { useEffect,  } from 'react'
import "./Notes.css"

import 'quill/dist/quill.snow.css';


const Notes = ({children}) => {

  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu")
    document.body.style.overflow="visible"
  }, [])


  return (
    <div id="notes" >
      <div className='wrapper-notes' >        
        
          {children}

      </div>
    </div>
  )
}

export default Notes
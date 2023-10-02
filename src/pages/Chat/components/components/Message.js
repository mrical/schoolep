import React, { useEffect, useRef } from 'react'
import { useChat } from '../../../../context/ChatContext'
import { useAuth } from '../../../../context/AuthContext'

const Message = ({ message, fromId }) => {
   
  const { data } = useChat()  
  const { currentUser } = useAuth()


  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [message]);

  return (
    <>
    
     {message && 
     
     <div ref={ref} className={fromId === currentUser.uid ? "message right-mess" : "message left-mess"} >
        <p>{message}</p>
     </div>
     
     }
    
    </>
  )
}

export default Message
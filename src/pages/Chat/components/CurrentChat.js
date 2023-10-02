import React, { useEffect, useState } from 'react'
import { useChat } from '../../../context/ChatContext';
import { onValue, ref, remove } from 'firebase/database';
import { rdb } from '../../../firebase';
import { ArrowBack, MoreVert } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import TopBar from './components/TopBar';
import Messages from './components/Messages';
import Input from './components/Input';


const CurrentChat = () => {

  const { data, dispatch } = useChat();
  const { currentUser } = useAuth();

  return (
    <>
    {data && 
          <div id="chat-wrapper" >
              <TopBar />
              <Messages />
              <Input />
          </div>        
    }
    </>
  )
}

export default CurrentChat
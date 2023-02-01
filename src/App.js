import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Loading from './components/Loading/Loading'
import "./App.css"
import logo from "./assets/logo_white.png"
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SettingsIcon from '@mui/icons-material/Settings';
import { AutoAwesomeMotion, ListAltSharp, Notes } from '@mui/icons-material'
import { List } from '@mui/material'
import { rdb } from './firebase'
import { OnDisconnect, onDisconnect, ref, remove, set } from 'firebase/database'
import { useAuth } from './context/AuthContext'

const App = ({children}) => {


  const [loading, setLoading] = useState(true)

  let location = useLocation();
  let path = location.pathname

  const { currentUser } = useAuth()

  useEffect(() => {
  
    setTimeout(() => {
      setLoading(false)
      document.title = "Schoolep"
    }, 1000)
   

      const reference = ref(rdb,`/online/${currentUser.uid}/`);


      set(reference, true).then(() => {
        console.log("online")
      })


  }, [])

  return (
    <>
    { !loading ? 
      <div id="main" >

            <div className='navbar left-side ' >
              <nav>
                <img src={logo} alt="logo" />
                <ul>
                  <Link to="/" className={path === "/" ? "active" : null} >
                    <HomeIcon />
                    Domov
                  </Link>
                  <Link to="/chat" className={path === "/chat" ? "active" : null} >
                    <ChatIcon />
                    Chat
                  </Link>
                  <Link to="/notes" className={path.includes("notes") ? "active" : null}>
                    <AutoAwesomeMotion  />
                    Poznámky
                  </Link>
                  <Link to="/schoolepai" className={path === "/schoolepai" ? "active" : null}>
                    <SmartToyIcon />
                    SchoolepAI
                  </Link>
                  <Link to="/settings" className={path === "/settings" ? "active" : null}>
                    <SettingsIcon />
                    Nastavania
                  </Link>
                </ul>
              </nav>
            </div>

          <div className='right-side' >
            {children}
          </div>

      </div> : <Loading />
    }
  </>
  )
}

export default App
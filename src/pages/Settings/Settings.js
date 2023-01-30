import { onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { auth, rdb } from '../../firebase'
import "./Settings.css"

const Settings = () => {

  const [user, setUser] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [passwordConfirm, setPasswordConfirm] = useState()

  const { currentUser } = useAuth()

    
  const getUser = () => {
    const starCountRef = ref(rdb, `users/${currentUser.uid}`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUser(data);
      setUsername(data.username)
    });
  }

  useEffect(() => {
    getUser()
    
  }, [])

  return (

    /*
    <div id="settings" >
      <div className='wrapper-settigns' >
        <div className='titles' >
            <h2>Nastavenia</h2>
        </div>
        {user && 
        <div className='content' >
          <img src={user.profilePic} />
          <p >{user.email}</p>
          <div className='wrapper' >
          <div className='username' >
            <h4>Zmena použivatelského mena</h4>
            <input placeholder="Username" value={username} />
            <button>Zmenit username</button>
          </div>
          
          <div className='password' >   
            <h4>Zmena hesla</h4>
            <input placeholder='new password'  />
            <input placeholder='new confirm password' />
            <button>Zmenit heslo</button>
          </div>
          </div>
        </div>
        }
      </div>
    </div> */

        <>
          {user && <div id="settings" >
            <div className='wrapper-settings' >
              <div className='content' >
               <img src={user.profilePic} alt="profile pic" />
               <h2>{user.username}</h2>
               <h4>{user.email}</h4>
               <div className='change-password' >
                <input placeholder='password' />
                <input placeholder='password confirm' />
               </div>
              </div>
            </div>
          </div>}
        </>

  )
}

export default Settings
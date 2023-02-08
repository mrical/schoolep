import { Add, Check, Edit, Save } from '@mui/icons-material'
import { onValue, ref, update } from 'firebase/database'
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as set } from "firebase/storage";
import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { auth, rdb, sdb } from '../../firebase'
import "./Settings.css"

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
const Settings = () => {

  const [user, setUser] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [passwordConfirm, setPasswordConfirm] = useState()

  const [editUsername, setEditUsername] = useState(false)

  const [visiblePassword, setVisiblePassword] = useState(false)
  const [visiblePasswordCon, setVisiblePasswordCon] = useState(false)

  const { currentUser , updateUserPassword } = useAuth()

  const [fileImg, setFileImg] = useState()
  const [filImg, setFilImg] = useState()

  const navigation = useNavigate()

  const passwordRef = useRef()
  const passwordConRef = useRef()
    
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
    document.getElementById("menu").classList.remove("left-menu")
  }, [])

  const handlerUploadImg = () => {
        
    const fileSelector = document.querySelector('.file_input_img');
    var clickEvent = new MouseEvent('click', {bubbles: true});
    fileSelector.dispatchEvent(clickEvent);        

}

/* Pick Image in Message */
const handlerChangeInputImg = (e) => {
  let fileImg = e.target.files[0];
  if(fileImg) {
  const reader = new FileReader();
  reader.onload = function(){
      const result = reader.result;
      setFileImg(result)
  }
  reader.readAsDataURL(fileImg);
  }

  setFilImg(fileImg);

}

const handleSave = async() => {
  if(fileImg) {

    const pathRef = set(sdb, "users/" + currentUser.uid + "/profile-picture/" + fileImg.name)

    uploadBytes(pathRef, filImg).then(() => {
      getDownloadURL(pathRef).then((url) => {
        update(ref(rdb, "users/" + currentUser.uid), {
          profilePic: url
        })
      })
    })
  }

  if(username) {
    update(ref(rdb, "users/" + currentUser.uid), {
      username: username
    })
  }

  if(passwordConRef.current.value.length > 5 && passwordConRef.current.value === passwordRef.current.value) {
    try {
      await updateUserPassword(passwordRef.current.value)
    }catch(err) {
      console.log(err.message)
    }
  }else if(passwordConRef.current.value.length > 5 && passwordConRef.current.value !== passwordRef.current.value ) {
    alert("nove heslo sa nezhoduje s potvrdenim hesla !")
  }


    /*.put(filImg).then(() => {
      sdb
    .ref("users")
    .child(currentUser.uid + "/profile-picture/" + filImg.name).getDownloadURL().then((url) => {
       db.collection("users").doc(currentUser.uid).update({
           profilePic: url
       })
     })
    })
    setChoose("") */
  
  setFilImg(null)
  setFileImg(null)

  navigation("/")

}


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
          <input type="file" className="file_input_img" accept="image/png, image/gif, image/jpeg" onChange={handlerChangeInputImg} />
            <div className='wrapper-settings' >
              <div className='content' >
                <div onClick={handlerUploadImg} className='edit-image' >
                  <img  src={fileImg || user.profilePic} alt="profile pic" />
                  <Add className='change-image-icon' />
                </div>
               <div className='edit-username' >
                <h2 contentEditable={editUsername ? true : false} onKeyDown={(e) => {
                      if (e.which === 13) {
                        e.preventDefault();
                      }
                  }} onChange={(e) => console.log(e)} onKeyUp={(e) => {
                      setUsername(e.target.innerText)
                      console.log(e.target.innerText)
                  }} >{user.username}</h2>
                { !editUsername && <Edit className='edit-username' onClick={() => setEditUsername(true)} />}
                { editUsername && <Check className='edit-username' onClick={() => setEditUsername(false)}/>}
               </div>
               <h4>{user.email}</h4>
               <div className='change-password' >
                <h4>Zmeniť heslo</h4>
               <div className='password' >
                  <input ref={passwordRef} type={!visiblePassword ? "password" : "text"} placeholder='Nove heslo' />
                  { visiblePassword && <VisibilityIcon onClick={() => setVisiblePassword(false)}  className='psw-icon' />}
                  { !visiblePassword && <VisibilityOffIcon onClick={() => setVisiblePassword(true)} className='psw-icon' />}
                </div>
                <div className='password-c' >
                  <input ref={passwordConRef} type={!visiblePasswordCon ? "password" : "text"} placeholder='Nove heslo - potvrdenie' />
                  { visiblePasswordCon && <VisibilityIcon onClick={() => setVisiblePasswordCon(false)}  className='psw-icon' />}
                  { !visiblePasswordCon && <VisibilityOffIcon onClick={() => setVisiblePasswordCon(true)} className='psw-icon' />}
                </div>
               </div>
               <button onClick={handleSave} >Uložiť zmenu</button>
              </div>
            </div>
          </div>}
        </>

  )
}

export default Settings
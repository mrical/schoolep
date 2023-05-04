import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "../../style/auth.css"

import RightSide from '../../components/RightSide/RightSide'
import logo from "../../assets/logo.png"

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {


    const { signup } = useAuth()

    const [visiblePassword, setVisiblePassword] = useState(false)
    const [visiblePasswordCon, setVisiblePasswordCon] = useState(false)

    const [error, setError] = useState("")

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConRef = useRef()


    //zmeni title
    useEffect(() => {
      document.title = "Schoolep - vytvoriť učet"
    }, [])
    


    //vytvorenie uctu
    const handleSignup = async() => {


    

      try {
        if(passwordConRef.current.value === passwordRef.current.value && passwordRef.current.value.length > 5) {
          setLoading(true)
          await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value)
            .then(() => setTimeout(() => {navigate("/")}, 1000))
        }else if(passwordRef.current.value.length < 5){
          setError("Heslo musi obsahovať viac než 6 znakov")
        }
        else{
          document.querySelector(".password .psw-icon").classList.add("ani-icon")
          document.querySelector(".password-c .psw-icon").classList.add("ani-icon")
          setError("Heslo sa nezhoduje s potvrdzujucím heslom, skotrolujte poriadne a skuste znova")
          setTimeout(() => {
            document.querySelector(".password .psw-icon").classList.remove("ani-icon")
            document.querySelector(".password-c .psw-icon").classList.remove("ani-icon")
          }, 500)
        }

      }catch(err) {
       setLoading(false)
       console.log(err)
       switch(err.code) {
        case "auth/email-already-in-use": 
        setError("Email, ktorý ste zadali už niekto iný používa. Skontrolujte email a skuste to znova")
        break;
       }
      }
    
      setTimeout(() => {
        setError("")
      }, 10000)
    }

  return (
    <div id='auth' >
      <div className='wrapper' >
         <div className='left-side' >
            <div className='content' >
              <img src={logo} className="auth-logo logo" />
              <h2 className='auth-title' >Vytvoriť učet</h2>
              {error && <p className='auth-subtitle' >{error}</p> }
              {!error && <p className='auth-subtitle' >Vytvorením učtu na <span className="primary-color">schoolepe</span> sa možete spojiť a naviazať konverzaciu so svojimi priatelmi</p> }
              <div className='inputs' >
                <div className='ema-usr' >
                <input ref={emailRef} type="email" placeholder='Email' />
                <input ref={usernameRef} type="text" placeholder='Username' />
                </div>
                <div className='password' >
                  <input ref={passwordRef} type={!visiblePassword ? "password" : "text"} placeholder='Password' />
                  { visiblePassword && <VisibilityIcon onClick={() => setVisiblePassword(false)}  className='psw-icon' />}
                  { !visiblePassword && <VisibilityOffIcon onClick={() => setVisiblePassword(true)} className='psw-icon' />}
                </div>
                <div className='password-c' >
                  <input ref={passwordConRef} type={!visiblePasswordCon ? "password" : "text"} placeholder='Password Confirm' />
                  { visiblePasswordCon && <VisibilityIcon onClick={() => setVisiblePasswordCon(false)}  className='psw-icon' />}
                  { !visiblePasswordCon && <VisibilityOffIcon onClick={() => setVisiblePasswordCon(true)} className='psw-icon' />}
                </div>
              </div>
              <button className='auth-btn' disabled={loading} onClick={handleSignup} >Vytvoriť</button>
              <a className='auth-question' >Už máš účet ?  <Link className='primary-color' to="/login" >Prihlásiť sa</Link></a>
            </div>
         </div>
        <RightSide />
      </div>
    </div>
  )
}

export default Signup
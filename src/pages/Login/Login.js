import React, { useState, useEffect, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom';
import "../../style/auth.css"

import RightSide from '../../components/RightSide/RightSide'
import logo from "../../assets/logo.png"

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BrandingWatermark } from '@mui/icons-material';

const Login = () => {

  const { login, currentUser } = useAuth()
  let navigate = useNavigate();
  const [visiblePassword, setVisiblePassword] = useState(false)
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

  const emailRef = useRef()
  const passwordRef = useRef()

  useEffect(() => {
    document.title = "Schoolep - prihlásiť sa"
  }, [])
  
  
  const handleLogin = async() => {


      try {
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)
          .then(() => setTimeout(() => {navigate("/")}, 1000))
      }catch(err) {
       setLoading(false)
       switch (err.code){
        case "auth/invalid-email":
          setError("Nesprávna emailova adresa, prosím zadajte správnu emailovu adresu")
          break;
        case "auth/wrong-password": 
          setError("Uppss, nesprávne heslo, skontrolujte či ste ho zadali spravne a skúste to znova")
          document.querySelector(".psw-icon").classList.add("ani-icon")
          setTimeout(() => {
            document.querySelector(".psw-icon").classList.remove("ani-icon")
          }, 1000)
          break;
        case "auth/user-not-found": 
          setError("Daný použivateľ sa nenašiel, pozorne skontrolujte svojú emailovu adresu")
          break;
        case "auth/too-many-requests":
          setError("Príliš veľa nesprávnych pokusov, skuste to neskôr")
       }
      }
    
      setTimeout(() => {
        setError("")
      }, 5000)
     

  }

  return (
    <div id='auth' >
      <div className='wrapper' >
         <div className='left-side' >
            <div className='content' >
              <img src={logo} className="auth-logo logo" />
              <h2 className='auth-title' >Prihlásiť sa</h2>
              {error && <p className='auth-subtitle' >{error}</p>}
              {!error && <p className='auth-subtitle' >Prihláste sa do učtu na <span className='primary-color' >schoolepe</span> a naviažte konverzaciu so svojimi priatelmi</p> }
              <div className='inputs' >
                <input ref={emailRef} type="email" placeholder='Email' />
                <div className='password' >
                  <input ref={passwordRef} type={!visiblePassword ? "password" : "text"} placeholder='Password' />
                  { visiblePassword && <VisibilityIcon onClick={() => setVisiblePassword(false)}  className='psw-icon' />}
                  { !visiblePassword && <VisibilityOffIcon onClick={() => setVisiblePassword(true)} className='psw-icon' />}
                </div>
              </div>
              <a className='auth-forgot' >Zabudol si heslo ?</a>
              <button className='auth-btn' disabled={loading} onClick={handleLogin} >Prihlásiť sa</button>
              <a className='auth-question' >Ešte nemáš učet ?  <Link className='primary-color' to="/signup" >  Vytvoriť učet</Link></a>
            </div>
         </div>
        <RightSide />
      </div>
    </div>
  )
}

export default Login
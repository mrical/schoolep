import React, { useState, useEffect, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom';
import "../../style/auth.css"

import RightSide from '../../components/RightSide/RightSide'
import logo from "../../assets/logo.png"


import { useAuth } from '../../context/AuthContext';


const Login = () => {

  const { resetPassword } = useAuth()

  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

  const emailRef = useRef()

  useEffect(() => {
    document.title = "Schoolep - prihlásiť sa"
  }, [])
  
  
  const handleReset = async() => {

    console.log(emailRef.current.value)

      try {
        await resetPassword(emailRef.current.value)
        setError("Skontrolujte si svoju emailovu schránku")
        emailRef.current.value = ""

      }catch(err){
        switch (err.code){
            case "auth/user-not-found": 
              setError("Daný použivateľ sa nenašiel, pozorne skontrolujte svojú emailovu adresu")
              break;
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
              <h2 className='auth-title' >Zabudli ste heslo ?</h2>
              {error && <p className='auth-subtitle' >{error}</p>}
              {!error && <p className='auth-subtitle' >Stači zadať email a my vám pošleme do vašej emailovej schránky resetovanie hesla. </p> }
              <div className='inputs' >
                <input ref={emailRef} type="email" placeholder='Email' />
              </div>
              <button className='auth-btn' disabled={loading} onClick={handleReset} >Resetovať heslo</button>
              <a className='auth-question' ><Link className='primary-color' to="/signup" >  Vytvoriť učet </Link><Link className='primary-color' to="/login" >Prihlásiť sa</Link></a>
            </div>
         </div>
        <RightSide />
      </div>
    </div>
  )
}

export default Login
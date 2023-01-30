import React,{ useEffect } from 'react'
import './Loading.css'

import logo from '../../assets/logo_white.png'

const Loading = () => {

    useEffect(() => {
      
        document.title = "Schoolep - načitávam"
      
    }, [])
    


  return (
    <div className='loading' >

        <img src={logo} alt='logo' />

    </div>
  )
}

export default Loading
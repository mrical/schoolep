import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Home = () => {

  const { logout } = useAuth()

  useEffect(() => {
    
  }, [])

  const handleLogout = async() => {

    try{
      await logout()
        
    }catch(err) {
      console.log(err)
    }

  }

  return (
    <>
      <div><button onClick={handleLogout} >LOGOUT</button>Home</div>
    </>

  )
}

export default Home
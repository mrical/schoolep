import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

import "./Thinks.css"

const Thinks = (props) => {

    const { currentUser } = useAuth()


    const [friend, setFriend] = useState()


    const getUser = () => {
      console.log("get user")
    }

    useEffect(() => {
        getUser()
    }, [])


  return (
    <>
       {

        props.user.bio && 

        <div onClick={() => props.setActiveFriend(props.user.id)} className='thinks' >
            <div className='img-wrp' >
                 <img src={props.user.profilePic} />
                 <p>{props.user.bio}</p>
            </div>
            <h5>{props.user.username}</h5>
        </div>

       }
       
    </>
  )
}

export default Thinks
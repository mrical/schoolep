import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

import "./UnSeen.css"

const UnSeen = (props) => {

    const { currentUser } = useAuth()


    const [friend, setFriend] = useState()


    const getUser = () => {
        props.users.filter((f) => {
            return f.id === props.user.id
          }).map((f) => {
            setFriend(f)
        })
    }

    useEffect(() => {
        getUser()
    }, [])


  return (
    <>
       {

        friend && 

        <div className='unseen' >
            <div className='img-wrp' >
                 <img src={friend.profilePic} />
            </div>
            <h3>{friend.username}</h3>
        </div>

       }
       {

        !friend && <p>Nooo new messages</p>

       }
    </>
  )
}

export default UnSeen
import { Add, ArrowBack, ArrowForward, ArrowForwardIos, ArrowForwardRounded, ArrowRight, Equalizer, Message, Note, TextSnippet } from '@mui/icons-material'
import { equalTo, onValue, orderByChild, orderByValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UnSeen from '../../components/UnSeen/UnSeen'
import { useAuth } from '../../context/AuthContext'
import { rdb } from '../../firebase'
import "./Home.css"

import bot from "../../assets/bot.svg"

const Home = () => {

  const { currentUser } = useAuth()

  const [notes, setNotes] = useState()
  const [allNotes, setAllNotes] = useState()


  const [allFriends, setAllFriends] = useState()
  const [friends, setFriends] = useState()


  const [allUsers, setAllUsers] = useState()
  const [users, setUsers] = useState()

  const [user, setUser] = useState()

  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu")
  }, [])

  const getNotes = () => {
    const starCountRef = ref(rdb, `notes/${currentUser.uid}/all/`);
    onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    setNotes(data);
    });
  }

  const getUsers  = () => {
    const starCountRef = ref(rdb, `users/`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data);
    });
  }






 
  const notes_w = document.getElementById("notes_w")


  const handleMoveRight = () => {
      notes_w.scroll({
        left: notes_w.scrollLeft + 200,
        behavior: "smooth"
      })
  }


  const handleMoveLeft = () => {
    notes_w.scroll({
      left: notes_w.scrollLeft - 200,
      behavior: "smooth"
    })
  }



  const getFriends = () => {

 
     const starCountRef = ref(rdb, `users/${currentUser.uid}/messages/`);
     onValue(starCountRef, (snapshot) => {
       const data = snapshot.val();
       setFriends(data);
     });
 
   }
  const getUser = () => {

 
     const starCountRef = ref(rdb, `users/${currentUser.uid}/`);
     onValue(starCountRef, (snapshot) => {
       const data = snapshot.val();
       setUser(data);
     });
 
   }


  


  useEffect(() => {
    getNotes()
    getUsers()
    getFriends()
    getUser()
  }, [])


  useEffect(() => {
    
    let array = []
        
     for(let i in friends) {
         array.push(friends[i])
         setAllFriends(array)
     }
     if(array.length === 0) {
         setAllFriends(array)
     }

  }, [friends])
  useEffect(() => {
    
    let array = []
        
     for(let i in users) {
         array.push(users[i])
         setAllUsers(array)
     }
     if(array.length === 0) {
         setAllUsers(array)
     }

  }, [users])


  useEffect(() => {
    let array = []
            
    for(let i in notes) {
        array.push(notes[i])
        setAllNotes(array)
    }
    if(array.length === 0) {
        setAllNotes(array)
    }
  }, [notes])  


  return (
    <>
      <div id="home">
        <div className='wrapper-home' >
          <div className='titles' >
            {user &&
            <h3>Vitajte, {user.username}</h3>
            }
          </div>
          <div className='content' >
            <div className='content-flexi' >
              <div className='big-b box' >

                  
                  {user && 
                  <div className='pozvanka' >

                    <img src={user.profilePic} />

                    <input placeholder='Napište poznámku, pocity, naladu' />
                    
                    <button>Uložiť</button>

                  </div>
                  }



              </div>
              <div className='small-b box only_notes' >
              <div className='title' >
                <TextSnippet className='titles-icon' />
                <h3>Všetky poznamky</h3>
                <Link className='create-icon' to="/notes/create">
                  <Add/>
                </Link>
                <div className='move_right' >
                <ArrowBack  className='icon' onClick={handleMoveLeft} />
                <ArrowForward className='icon' onClick={handleMoveRight} />
              </div>
               </div>
                <div className='notes' id="notes_w" >
                    {allNotes &&
                        allNotes.map((n) => (
                            <Link className='note-a' to={"/notes/note/" + currentUser.uid +"/"+n.id} >
                            <div className='note' key={n.id} >
                              <Note />
                              {n.note_name && <h4>{n.note_name.length > 60 ? n.note_name.substr(0, 50) + "..." : n.note_name}</h4> }
                            </div>
                            </Link>
                        ))
                    }
                    {
                        !notes && <p className='no-notes' >Nemáš žiadne poznámky zatiaľ, stáčí kliknuť na plusko a možeš si vytvoriť novú poznámku.</p>
                    }
              </div>


              

              </div>
            </div>
            <div className='content-flexi' >
              <div className='small-b box' >


              <div className='title' >
                <Message className='titles-icon' />
                <h3>Neprečítane spravy</h3>
                <Link className='create-icon' to="/chat">
                  <ArrowForwardRounded/>
                </Link>
               </div>

               <div className='unseen-wrp' >
           
     

                  {friends &&

                    allFriends.filter((a) => {
                      return a.saw == false
                    }).map((f) => (
                        <Link to="/chat" >
                          <UnSeen users={allUsers} user={f} />
                        </Link>
                      
                    )) 

                  }
                  {friends &&

                        allFriends.filter((a) => {
                          return a.saw == false
                        }).length === 0 && <p className='no-new-messages' >Žiadne nové správy. Všetko máte prečitane.</p>

                        

                  }

                  {console.log(allFriends)}


               

              </div>
              
              </div>
              <div className='big-b box' >

              <Link to={"/schoolepai"} >
                  <div className='schoolep_wrp' >
                    <img src={bot} />
                    <h3>SchoolepAI tvoj pomocík k nadobudnutiu vedomostí</h3>
                  </div>
              </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Home
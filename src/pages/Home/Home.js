import { Add, ArrowBack, ArrowForward, ArrowForwardRounded, Message, Note, TextSnippet } from '@mui/icons-material'
import { onValue, ref, update } from 'firebase/database'
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
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()

  const [bio, setBio] = useState()

  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu")
    document.body.style.overflow="visible"
  }, [])

  //DOSTANES VSETKY NOTES POUZIVATELA
  const getNotes = () => {
    const starCountRef = ref(rdb, `notes/${currentUser.uid}/all/`);
    onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    setNotes(data);
    });
  }

  //DOSTANES VSETKYCH USERS
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



  //dostanes priatelov
  const getFriends = () => {

 
     const starCountRef = ref(rdb, `users/${currentUser.uid}/messages/`);
     onValue(starCountRef, (snapshot) => {
       const data = snapshot.val();
       setFriends(data);
     });
 
   }

   //dostanes info o uzivvatelovi
  const getUser = () => {
     const starCountRef = ref(rdb, `users/${currentUser.uid}/`);
     onValue(starCountRef, (snapshot) => {
       const data = snapshot.val();
       setUser(data);
       setBio(data.bio)
     });
  }


  


  //vyvolane fukncie po nacitani webu
  useEffect(() => {
    getNotes()
    getUsers()
    getFriends()
    getUser()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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


  const handleChangeMood = (mood) => {


    update(ref(rdb, "users/" + currentUser.uid), {
      mood: mood
    })



  }


  const handleUpdateBio = () => {
    update(ref(rdb, "users/" + currentUser.uid), {
      bio: bio
    })
  }

  return (
    <>
      <div id="home">
        <div className='wrapper-home' >


            <div className='content' >
               
               {/* NADPIS VITAJ POUZIVATELSKE MENO  */}
                <div className='titles' >
                  {user &&
                  <h3>Vitajte, {user.username}</h3>
                  }
                </div>

               
             
                  {/* POZNAMKY */}
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
                  {/* POZNAMKY */}


                    {/* CHAT */}
                    <div className='small-b box' >
                      <div className='title' >
                        <Message className='titles-icon' />
                        <h3>Neprečítane spravy</h3>
                        <Link className='create-icon' to="/chat">
                          <ArrowForwardRounded/>
                        </Link>
                      </div>

                      <div className='unseen-wrp' >
           
                          {friends && !loading &&

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

                      </div>
                    </div>
                    {/* CHAT */}

                    {/* SCHOOLEPAI */}
                    <div className='small-b box' >
                          <Link className='link-to-ai' to={"/schoolepai"} >

                              <div className='schoolep_wrp' >
                                <img src={bot} />
                                <h3>SchoolepAI tvoj pomocík k nadobudnutiu vedomostí</h3>
                              </div>
                          </Link>

                    </div>
                    {/* SCHOOLEPAI */}

            </div>

            
            {/* PROFILE */}
            <div className='big-b box profile-right' >
              
                {user && 
                <div className='profile' >

                  <div className='titles' >
                  <img src={user.profilePic} />
                  <h3 className='email' >{user.email}</h3>
                  </div>


                  <div className='moods' >
                    <h3>Akú máte náladu ?</h3>
                    <div className='mood-wrapper' >
                      <span onClick={() => {handleChangeMood("🥰")}} className={user.mood == "🥰" ? "active" : null} >🥰</span>
                      <span onClick={() => {handleChangeMood("😂")}} className={user.mood == "😂" ? "active" : null} >😂</span>
                      <span onClick={() => {handleChangeMood("🙂")}} className={user.mood == "🙂" ? "active" : null} >🙂</span>
                      <span onClick={() => {handleChangeMood("😔")}} className={user.mood == "😔" ? "active" : null} >😔</span>
                      <span onClick={() => {handleChangeMood("😤")}} className={user.mood == "😤" ? "active" : null} >😤</span>
                    </div>
                  </div>

                  <div className='bio' >
                     <h3>Zdielajte svoje myšlienky</h3>
                     <p>Tvoje myšlienky uvidia len ludia s ktorymi si píšeš.</p>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Napíšte niečo...' />
                   <button onClick={handleUpdateBio} >Uložiť</button>
                  </div>

                </div>
                }

            </div>
            {/* PROFILE */}

        </div>
      </div>
    </>

  )
}

export default Home
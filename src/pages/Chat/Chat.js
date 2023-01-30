import { MoreVert, Search, Send } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import "./Chat.css"
import { doc, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { db, rdb } from "../../firebase.js"
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext'
import Friend from '../../components/Friend/Friend';
import { child, get, getDatabase, onValue, orderByChild, push, ref, remove, set } from 'firebase/database';
import { async } from '@firebase/util';
import { OptionGroupUnstyled } from '@mui/base';

const Chat = () => {
  
  const [users, setUsers] = useState()
  const [allUsers, setAllUsers] = useState()
  const [allFriends, setAllFriends] = useState()
  const [searchFriend, setSearchFriend] = useState("")
  const [activeFriend, setActiveFriend] = useState("")
  const [dataActiveFriend, setDataActiveFriend] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteSection, setDeleteSection] = useState(false)


  const [friends, setFriends] = useState()


  const [message, setMessage] = useState("")

  const { currentUser } = useAuth()
  
  const dbRef = ref(getDatabase());

  const [messages, setMessages] = useState()
  const [allmessages, setAllMessages] = useState()


  const [userData, setUserData] = useState()
  

  //DOSTAT DATA OD CURRENT UZIVATELA
  const getCurrentUserData = () => {
    const starCountRef = ref(rdb, `users/${currentUser.uid}/`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUserData(data);
    });
  }

  //DOSTAT VSETKYCH UZIVATELOV
  const getUsers = async() => {
    /*const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("username"));

    await getDocs(q)
        .then((querySnapshot)=>{               
          const data = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setUsers(data);                
    })*/


    /*get(child(dbRef, `users/`)).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val()
        setUsers(data)
      } else {
        setUsers()
      }
    }).then(() => {
      
    }).catch((error) => {
      console.error(error);
    });*/

    const starCountRef = ref(rdb, `users/`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data);
    });


  }

  //DOSTAT ACTIVNEHO FRIENDA
  const getActiveFriend = () => {
 
      const starCountRef = ref(rdb, `users/` + activeFriend);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setDataActiveFriend(data);
        console.log(data)
        setDeleteSection(false)
        setTimeout(() => {
          const message_ele = document.querySelector(".message:nth-last-child(1)")
          message_ele.scrollIntoView();
        }, 100)
     });


    }
    
  //HANDLER NA POSLANIE SPRAVY
  const handleSendMessage = () => {
        if(message.length > 0) {
          sendMessage(currentUser.uid, activeFriend, message, new Date())
          //getMessages()
          //getFriends()
          setMessage("")
          setTimeout(() => {
            const message_ele = document.querySelector(".message:nth-last-child(1)")
            message_ele.scrollIntoView();
            //var objDiv = document.getElementById("chat-center");
            //objDiv.scrollTop = objDiv.scrollHeight;
          }, 300)
        }
  }



 
  //POSLANIE SPRAVY DO RDB 
  const sendMessage = (fromId, toId, message, date) => {

   //const autoId = rdb.ref('messages/' + fromId + toId).push().key
   const autoId = push(ref(rdb, "message")).key

    set(ref(rdb, 'messages/' + fromId + toId + "/" + autoId), {
      fromId: fromId,
      toId: toId,
      message: message,
      date: date
    });
    
    set(ref(rdb, 'messages/' + toId + fromId + "/" + autoId), {
      fromId: fromId,
      toId: toId,
      message: message,
      date: date
    });


    set(ref(rdb, 'users/' + currentUser.uid + "/messages/" + activeFriend), {
      message: message,
      timestamp: new Date().valueOf(),
      fromId: currentUser.uid,
      toId: activeFriend, 
      id: activeFriend, 
      saw: true,
      username: allUsers.filter(user => {return user.id === activeFriend}).map(user => { return user.username}),
    });

    set(ref(rdb, 'users/' + activeFriend + "/messages/" + currentUser.uid), {
      message: message,
      timestamp: new Date().valueOf(),
      fromId: currentUser.uid,
      toId: activeFriend, 
      id: currentUser.uid, 
      saw: false,
      username: allUsers.filter(user => {return user.id === activeFriend}).map(user => { return user.username}),
    });


    setTimeout(() => {
      getMessages()
      console.log("Sdasdas")
    }, 100)
    


  }
 

  //DOSTAT VSETKY SPRAVY S ACTIVE FRIEND Z RDB
  const getMessages = () => {
    /*get(child(dbRef, `messages/${currentUser.uid + activeFriend}/`)).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val()
        setMessages(data)
      } else {
        setMessages()
      }
    }).then(() => {
      
    }).catch((error) => {
      console.error(error);
    });*/


    const starCountRef = ref(rdb, `messages/${currentUser.uid + activeFriend}/`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data);
      setTimeout(() => {
        const message_ele = document.querySelector(".message:nth-last-child(1)")
        message_ele.scrollIntoView();
      }, 100)
    });


  }

 
  const getFriends = () => {

   /* get(child(dbRef, `users/${currentUser.uid}/messages/`)).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val()
        setFriends(data)
      } else {
        setFriends()
      }
    }).then(() => {
      
    }).catch((error) => {
      console.error(error);
    }); */

    const starCountRef = ref(rdb, `users/${currentUser.uid}/messages/`, orderByChild('timestamp'));
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setFriends(data);
    });

  }


  // PO NACITANI CHAT SECTION SA NACITAJU VSETKY USERS A FRIENDS
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if(!loading) {
      getUsers()
      getFriends()
      getCurrentUserData()
    }
  }, [loading])

  //AK SA CLIKNE NA FRIEND TAK SA VYKONA TOTO:  (DOSTANES VSETKY MESSAGES OD NEHO)
  useEffect(() => {

    if(activeFriend) {
      getActiveFriend()
      getMessages()
      console.log("active friend useEffect")
      if(messages) {
        setTimeout(() => {
          const message_ele = document.querySelector(".message:nth-last-child(1)")
          message_ele.scrollIntoView();
        }, 100)
      }
    }

  }, [activeFriend])

  //ZMENOU FRIENDA DOSTANES MESSAGES, ZMENOU MESSAGES DOSTANES NOVE MESSAGES
  /*useEffect(() => {

    if(activeFriend) {
     getMessages()
     getFriends()
    }

  }, [activeFriend, messages])*/


  //DAT MESSAGES Z JEDNOHO POLA DO POLA Z OBJEKTOM SPRAV
  useEffect(() => {

    console.log("useEffect messages")
    let array = []
        
     for(let i in messages) {
         array.push(messages[i])
         setAllMessages(array)
     }
     if(array.length === 0) {
         setAllMessages(array)
     }

  }, [messages])

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
        
     for(let i in friends) {
         array.push(friends[i])
         setAllFriends(array)
     }
     if(array.length === 0) {
         setAllFriends(array)
     }

  }, [friends])

  //ODOSLANIE SPRAVY POMOCOU ENTER
  const keyDownHandler = (e) => {
    if(e.keyCode === 13) {
        handleSendMessage()
    }
  }


  //VYMAZANIE CHATU
  const handleDeleteChat = () => {
    remove(ref(rdb, "messages/" + currentUser.uid + activeFriend))

    setActiveFriend()

    remove(ref(rdb, "users/"+currentUser.uid+"/messages/"+activeFriend))
  }



  



  return (
    <div id="chat" >
      <div className='wrapper-chat' >
        <div className='left-side friends white-box' >
            <div className='search' >
              <div className='search-input' >
                  <Search />
                  <input value={searchFriend} onChange={(e) => setSearchFriend(e.target.value)} placeholder='Vyhľadaj priateľov...' />
              </div>
            </div>
            <div className='friends-searched' >
            { allUsers && <div>
              {searchFriend.length > 1 && allUsers.filter(user => {
                  return user.id !== currentUser.uid && user.id !== activeFriend
              }).filter(user => {
                  const username = user.username.toLowerCase().includes(searchFriend.toLowerCase())
                  return username
              }).map(friend => (
                 <Friend handleSendMessage={handleSendMessage} allUsers={allUsers} key={friend.id} friend={friend} setActiveFriend={setActiveFriend} setSearchFriend={setSearchFriend} />
              ))}
              </div>}


              {/* Active Friend */}
              {activeFriend && 
                allUsers.filter((u) => {
                  return u.id === activeFriend && u.id !== currentUser.uid && allFriends.filter(f => {return f.id === u.id}).map(u => {return u.id}).length === 0
                }).map((friend) => (
                  <Friend handleSendMessage={handleSendMessage} allUsers={allUsers} key={friend.id} friend={friend} activeFriend={activeFriend} setActiveFriend={setActiveFriend} setSearchFriend={setSearchFriend} /> 
                ))
              }

                {!loading && users && friends && searchFriend.length < 1 &&

                  allFriends.sort((a, b) => {
                    return b.timestamp - a.timestamp
                  }).map((f) => (
                    <Friend handleSendMessage={handleSendMessage} allUsers={allUsers} key={f.id} friend={f} activeFriend={activeFriend} setActiveFriend={setActiveFriend} setSearchFriend={setSearchFriend} />
                  )) 

                
                
                }
               

                
                { allFriends && allUsers && !activeFriend &&
                  allFriends.length === 0 && searchFriend.length < 1 && <p className='no-friends' >
                    Zatiaľ nemáš žiadných priateľov stačí len vyhladať ich.
                  </p>
                }


             
            </div>
        </div>
        <div className='right-side r-messages white-box' id="messages" >
            {activeFriend && dataActiveFriend && 
            <div id="chat-wrapper" >
              <div className='top-bar'>
                  <div className='wrapper' >
                    <img src={dataActiveFriend.profilePic} />
                    <h3>{dataActiveFriend.username}</h3>
                  </div>
                  {deleteSection &&
                  <div onClick={handleDeleteChat} className='delete-section' >
                    <a>Delete</a>
                  </div> }
                  <MoreVert className='more-top' onClick={() => setDeleteSection(!deleteSection)} />
              </div>
              <div id="chat-center" className='center-bar messages' >

                 
                {allmessages && allmessages.map((m) => (
                  
                  <div className={m.fromId === currentUser.uid ? "message right-mess" : "message left-mess"} >
                    <p>{m.message}</p>
                  </div>
                  
                ))}



              </div>
              <div className='bottom-bar send-message' >
                  <div className='send-message' >
                    <input onKeyUp={keyDownHandler} value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Správa...' />
                    <Send  onClick={handleSendMessage}  className='send-icon' />
                  </div>
              </div>
            </div> }
            {!activeFriend && !dataActiveFriend && userData && 

             <div className='starter-chat' >
              <img src={userData.profilePic} />
              <h3>{userData.username}</h3>
              <p>Začnite chatovať so svojimi priateľmi</p>
             </div>
              
           }
        </div>
      </div>
    </div>
  )
}

export default Chat
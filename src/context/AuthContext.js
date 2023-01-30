import React, {useContext, useState, useEffect} from "react"
import { auth, db, sdb, rdb } from "../firebase.js";
import app from "../firebase.js"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,  updatePassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { OnDisconnect, onDisconnect, ref, set } from "firebase/database";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);


 
  // VYTVORENIE UCTU - potrebny: email, password, username
  async function signup(email, password, username) {
      return createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {

        // Vytvori učet v db - firestore database, resp ho nastavi (setDoc) do documentu "users"
        await setDoc(doc(db, "users", user.user.uid), {
          username: username,
          profilePic: "https://i.postimg.cc/zfP6Tk3W/profile-pic-default.png",
          email: email,
          id: user.user.uid,
          createdAt: new Date() 
        });      
        
        set(ref(rdb, 'users/' + user.user.uid), {
          username: username,
          profilePic: "https://i.postimg.cc/zfP6Tk3W/profile-pic-default.png",
          email: email,
          id: user.user.uid,
          createdAt: new Date() 
        });

      })
  }

  // PRIHLASENIE - potrebny: email, password
  async function login(email, password){
   return signInWithEmailAndPassword(auth, email, password)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }


  function updateDisplayName(name) {
    return currentUser.updateProfile({
         displayName: name
      })
  }


  function updateUserPassword(password) {
    return updatePassword(currentUser, password)
  }  

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })


    return unsubscribe


  }, [])

  


  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updateUserPassword,
    updateDisplayName, 
  }

  return(
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


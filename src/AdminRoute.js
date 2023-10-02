import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { db, rdb } from "./firebase";
import { onValue, ref } from "firebase/database";
import { onSnapshot,doc } from "firebase/firestore";

//If you are admin
export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  const [user, setUser] = useState(true);

  useEffect(() => {
    const getUser = () => {
      // const starCountRef = ref(rdb, `users/${currentUser.uid}`);
      const starCountRef = doc(db, `users/${currentUser.uid}`);
      onSnapshot(starCountRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUser(data);
        }
      });
      // onValue(starCountRef, (snapshot) => {
      //   const data = snapshot.val();
      //   setUser(data);
      // });
    };
    getUser();
  }, []);

  return (
    <>
      {user && user.admin ? (
        children
      ) : (
        <div id="error-page">
          <h2>{404}</h2>
          <h1>Oops! Not Found</h1>
          <p>Sorry, an unexpected error has occurred.</p>
        </div>
      )}
    </>
  );
}

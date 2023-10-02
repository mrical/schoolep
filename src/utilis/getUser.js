import { useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const useFetchUserData = (currentUser, setUser, setBio) => {
  useEffect(() => {
    const starCountRef = doc(db, `users/${currentUser.uid}/`);
    const onDataChange = (docSnapshot) => {
      if (!docSnapshot.exists()) return;
      const data = docSnapshot.data();
      setUser(data);
      if(setBio){
        setBio(data.bio);
      }
    };

    const unsubscribe = onSnapshot(starCountRef, onDataChange);

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, [currentUser, setUser, setBio]);
};

export default useFetchUserData;

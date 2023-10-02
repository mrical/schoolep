import { useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const useFetchUserFriends = (currentUser, setFriends, setAllFriends) => {
  useEffect(() => {
    const starCountRef = collection(db, `users/${currentUser.uid}/messages/`);
    const onDataChange = (docSnapshot) => {
      const array = docSnapshot.docs.map((childSnapshot) => {
        return childSnapshot.data();
      });
      console.log(array);
      setFriends(array);
      setAllFriends(array);
    };

    const unsubscribe = onSnapshot(starCountRef, onDataChange);

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, [currentUser, setFriends, setAllFriends]);
};

export default useFetchUserFriends;

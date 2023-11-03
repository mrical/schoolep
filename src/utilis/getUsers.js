import { useEffect } from "react";
import { db } from "../firebase";
import { collection,onSnapshot } from "firebase/firestore";

const useFetchUsers = (setUsers, setAllUsers) => {
  useEffect(() => {
    const starCountRef = collection(db, `users/`);
    const onDataChange = (docSnapshot) => {
      let array = docSnapshot.docs.map((childSnapshot) => {
        return childSnapshot.data();
      });
      setUsers(array);
      setAllUsers(array);
    };

    const unsubscribe = onSnapshot(starCountRef, onDataChange);

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, [setUsers, setAllUsers]);
};

export default useFetchUsers;

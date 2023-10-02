import { useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const useFetchUserNotes = (currentUser, setNotes, setAllNotes) => {
  useEffect(() => {
    const starCountRef = collection(db, `notes/${currentUser.uid}/all`);
    const onDataChange = (docSnapshot) => {
      const data = docSnapshot.docs.map((doc) => doc.data());
      if (data.length > 0) {
        setNotes(data);
        setAllNotes(data);
      } else {
        setNotes(null);
        setAllNotes(null);
      }
    };

    const unsubscribe = onSnapshot(starCountRef, onDataChange);

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, [currentUser, setNotes, setAllNotes]);
};

export default useFetchUserNotes;

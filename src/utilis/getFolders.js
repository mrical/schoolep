import { useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const useFetchUserFolders = (currentUser, setFolders, setAllFolders) => {
  useEffect(() => {
    const starCountRef = collection(db, `notes/${currentUser.uid}/folders/`);
    const onDataChange = (docSnapshot) => {
      // if (!docSnapshot.exists()) return;
      const data = docSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (data.length > 0) {
        setFolders(data);
        setAllFolders(data);
      } else {
        setFolders(null);
        setAllFolders(null);
      }
    };

    const unsubscribe = onSnapshot(starCountRef, onDataChange);

    return () => {
      // Unsubscribe from the Firebase listener when the component unmounts
      unsubscribe();
    };
  }, [currentUser, setFolders, setAllFolders]);
};

export default useFetchUserFolders;

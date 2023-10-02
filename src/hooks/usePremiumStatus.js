import { useState, useEffect } from "react";
import userType from "../utilis/userType";
import { db } from "../firebase";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { query } from "firebase/database";

export default function usePremiumStatus(user) {
  const [premiumStatus, setPremiumStatus] = useState({
    name: "Free",
    productId: "free",
    requestLimit: 3,
    loading: true,
  });
  useEffect(() => {
    if (user) {
      const checkPremiumStatus = async function () {
        const userProductId = await userType();
        if (!userProductId)
          setPremiumStatus((premiumStatus) => ({
            ...premiumStatus,
            loading: false,
          }));
        onSnapshot(doc(db, `products/${userProductId}`), (productSnapshot) => {
          if (productSnapshot.exists()) {
            onSnapshot(
              query(
                collection(db, `users/${user.id}/subscriptions`),
                where("status", "in", ["trialing", "active"])
              ),
              (docSnapshot) => {
                const subscriptionSnapshot = docSnapshot.docs[0];
                if (!subscriptionSnapshot)
                  setPremiumStatus((premiumStatus) => ({
                    ...premiumStatus,
                    loading: false,
                  }));
                setPremiumStatus({
                  name: productSnapshot.data().name,
                  expiryDate: subscriptionSnapshot
                    .data()
                    .current_period_end.toDate(),
                  productId: userProductId,
                  subscriptionId: subscriptionSnapshot.id,
                  requestLimit: productSnapshot.data().metadata.requestLimit,
                  loading: false,
                });
              }
            );
          }
        });
      };
      checkPremiumStatus();
    }
  }, [user]);

  return premiumStatus;
}

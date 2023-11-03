import React, { useEffect, useState } from "react";

const useUserCurrency = () => {
  const [userCurrency, setUserCurrency] = useState("usd");
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        const currency = response.country == "IN" ? "inr" : "usd";
        setUserCurrency(currency);
      })
      .catch((data, status) => {
        console.log("Request failed:", data);
        setUserCurrency("inr");
      });
  }, []);
  return userCurrency;
};

export default useUserCurrency;

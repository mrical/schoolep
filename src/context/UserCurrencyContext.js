import { createContext, useEffect, useState } from "react";

export const UserIPinfoContext = createContext();

export const UserIPinfoProvider = ({ children }) => {
  const [ipInfo, setIpInfo] = useState();
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((response) => {
        setIpInfo(response);
      })
      .catch((data, status) => {
        console.log("Request failed:", data);
        setIpInfo({ currency: "INR", country: "IN" });
      });
  }, []);
  return (
    <UserIPinfoContext.Provider value={{ ipInfo }}>
      {children}
    </UserIPinfoContext.Provider>
  );
};

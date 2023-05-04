import React from 'react'
import { Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

//Ak nie je currentUser vrati ma to do loginu pomocou Navigate
export default function PrivateRoute({ children }) {

  const { currentUser } = useAuth();

  return (
    currentUser ? children : <Navigate to="/login" />
  )
}

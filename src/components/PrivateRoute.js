/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react"
import { Route, Redirect } from "react-router-dom"

// authentication
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ redirect="/login", authStatus=true, component: Component, ...rest}) {
  const { userCredential } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return ((authStatus && userCredential) || (!authStatus && !userCredential))  ? <Component {...props} /> : <Redirect to={redirect} />
      }}
    ></Route>
  )
}
/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Helmet } from "react-helmet";
import Modal from "react-modal";

// authentication
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

// site pages

// main page
import Main from "./pages/Main";

// authentication pages
import PasswordResetRequest from "./pages/auth/PasswordResetRequest";
import PasswordReset from "./pages/auth/PasswordReset";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

export default function App() {
  useEffect(() => {
    Modal.setAppElement("#melody");
  }, []);

  return (
    <>
      {/* TODO: metadata implementation */}
      <Helmet>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.PUBLIC_URL} />
        <meta property="og:site_name" content="EVE : XCS" />
        <meta property="og:title" content="EVE : XCS" />
        <meta property="og:description" content="manage entry points with ease & fluidity." />
      </Helmet>
      {/* entry routing */}
      <Router>
        {/* pass the auth context to all pages */}
        <AuthProvider>
          <UserProvider>
            <Switch>
              {/* authentication pages */}
              <PrivateRoute exact path="/recover-account" component={PasswordResetRequest} redirect="/" authStatus={false} />
              <PrivateRoute path="/recover-account/resetPassword/:code" component={PasswordReset} redirect="/" authStatus={false} />
              <PrivateRoute exact path="/login" component={Login} redirect="/" authStatus={false} />
              <Route exact path="/signup" component={Signup} redirect="/" authStatus={false} />
              {/* 404 not found */}
              <Route exact path="/not-found" component={Main} />
              {/* ensure all paths after /profile are lowercase */}
              <Route sensitive path="/profile/:slug1*:slug2([A-Z]):slug3*/" render={props => <Redirect to={`${props.location.pathname.toLowerCase()}`} />} />
              <Route sensitive path="/@:slug1*:slug2([A-Z]):slug3*/" render={props => <Redirect to={`${props.location.pathname.toLowerCase()}`} />} />
              {/* profile page (don't require authentication) */}
              <Route path="/profile" component={Main} />
              {/* redirect @eve to /profile/eve */}
              <Redirect from="/@:username?" to="/profile/:username?"></Redirect>
              {/* main page w/ sub-routing */}
              <PrivateRoute path="/" component={Main} />
              {/* if all else fails, redirect to the 404 page */}
              <Redirect to="/not-found" />
            </Switch>
          </UserProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

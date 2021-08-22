/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
*/

// core imports
import React, { useState, useEffect, useContext } from "react";
import { Route, Switch, Redirect, Link } from "react-router-dom";

// external imports
import Footer from "components/Footer";

// authentication
import { AuthProvider, useAuth } from "contexts/AuthContext";
import { useUser } from "contexts/UserContext";

// pages
import Home from "./home/Home";
import Settings from "./user/Settings";
import Locations from "./location/Locations";
import Location from "./location/Location";
import LocationsCreate from "./location/LocationsCreate";
import Profile from "./user/Profile";
import NotFound from "./errorPage/NotFound";
import MainNavbar from "components/Navbar";

export default function Main(props) {
  const [isLoading, setLoading] = useState(true);
  // database stuff
  const { userCredential } = useAuth();
  const { userProfile, refreshUserProfile } = useUser();
  const [alert, setAlert] = useState(<></>);

  useEffect(() => {
    if (!userCredential) {
      console.log("no credentials found");
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      console.log("existing credential found");
      refreshUserProfile().then(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    setAlert(
      <>
        {(userCredential && !userCredential.emailVerified) && (
          <>
            <alert className="danger">
              <div>
                <h2 style={{ textAlign: "left" }}>EMAIL ADDRESS NOT VERIFIED</h2>
                <p>please verify your email address to gain access to most of the site's features.</p>
                <span>
                  <Link to="/settings" style={{ color: "var(--text-primary-dark)", fontWeight: "bold" }}>go to settings</Link>
                </span>
              </div>
            </alert>
            <br />
          </>
        )}
      </>
    );
  }, [userCredential]);

  return (
    <>
      <MainNavbar loadingState={[isLoading, setLoading]} />
      {!isLoading ? (
        <>
          <main>
            <Switch>
              <Route exact path="/">
                <Home alert={alert} />
              </Route>
              <Route path="/settings">
                <Settings alert={alert} />
              </Route>
              <Route path="/locations/create">
                <LocationsCreate alert={alert} />
              </Route>
              <Route path="/locations/:locationId">
                <Location alert={alert} />
              </Route>
              <Route exact path="/locations">
                <Locations alert={alert} />
              </Route>
              {
                userProfile && <Redirect exact from="/profile" to={`/profile/${userProfile.username}`}></Redirect>
              }
              {/* @ username handle is in App.js */}
              <Route path="/profile/:username?">
                <Profile alert={alert} />
              </Route>
              <Route path="/not-found">
                <NotFound />
              </Route>
              <Redirect to="/not-found" />
            </Switch>
            <Footer />
          </main>
        </>
      ) : (<></>)}
    </>
  );
}
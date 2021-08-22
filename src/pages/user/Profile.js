/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

// external imports
import Loader from "components/Loader";
import * as Icon from '@material-ui/icons';

import { useAuth } from "contexts/AuthContext";
import { useUser } from "contexts/UserContext";

import PageHeader from "components/PageHeader.js";
import { Helmet } from "react-helmet";
import UserBadge from "components/UserBadge";

export default function Profile(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);


  const [profileUser, setProfileUser] = useState();
  const { database } = useAuth();
  const { userProfile } = useUser();

  // prepare username for database checking
  let { username } = useParams();
  
  if (!(username)) {
    username = userProfile.username || null;
  }
  // check if the user even exists
  useEffect(() => {
    setLoading(true);
    const userCollection = database.collection("users");
    const query = userCollection.where("username", "==", username);
    query.get().then((users) => {
      if (users.size < 1) {
        history.push("/not-found"); // user not found
      } else { // user exists
        users.forEach(user => {
          setProfileUser(user.data());
        });
      }
      setLoading(false);
    });
  }, [username]);

  return (
    <>
      <Loader
        className={`loader loader-page loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      {props.alert}
      {!isLoading &&
        <>
          {/* page metadata */}
          <Helmet>
            <meta property="og:url" content={`${process.env.PUBLIC_URL}/@${username}`} />
            <meta property="og:site_name" content={`${username} | EVE : XCS`} />
            <meta property="og:title" content={`EVE : XCS : @${username}`} />
            <meta property="og:description" content={`view ${username}'s profile on EVE : XCS`} />
          </Helmet>
          {/* main content */}
          <div className="main-content">
            <PageHeader title={`${profileUser.username}'s Profile`} headerTitle={`${profileUser.username}'s PROFILE`.toUpperCase()} description={(userProfile && profileUser.username === userProfile.username) && "(you)"}/>
            <br />
            <div className="card" style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", height: "auto", maxWidth: "auto", marginBottom: "12px", overflowWrap: "break-word" }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "100%", maxHeight: "100%" }}>
                <div className="flex flex-column">
                  <img src={profileUser.profile.avatar} className="profile-image" style={{ borderRadius: "50%" }} draggable={false} />
                </div>
                <br />
                <div className="flex flex-column" style={{ paddingBottom: "12px", minWidth: "384px" }}>
                  <h2 style={{ margin: 0, padding: 0 }}><span style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", maxWidth: "100%" }}>{((profileUser.preferences.namePrivacy == "public" ? profileUser.profile.name : `@${profileUser.username}`))}<UserBadge user={profileUser} icon title /></span></h2>
                  {
                    (profileUser.preferences.namePrivacy === "public") &&
                    <p>@{profileUser.username}</p>
                  }
                  {
                    (profileUser.profile.website) &&
                    <a href={profileUser.profile.website} target="_blank">{profileUser.profile.website}</a>
                  }
                </div>
                {
                  /*
                    if the shown user is the logged in user, show an edit profile button
                  */
                  (userProfile && profileUser.username === userProfile.username) ?
                  <>
                    <div className="flex flex-column" style={{ minWidth: "384px" }}>
                      <Link exact to="/settings" className="button">
                        <Icon.AccountCircle />
                        <span>edit profile</span>
                      </Link>
                    </div>
                  </> : <></>
                }
              </div>
              <div style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", maxHeight: "auto", width: "100%" }}>
                <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", height: "100%", maxWidth: " auto", marginTop: "0px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", maxWidth: "100%", height: "100%" }}>
                    <h2>about me</h2>
                    <div className="flex flex-column">
                      <p>{profileUser.profile.about || "no description available."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}
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
import * as Icon from "@material-ui/icons";
import { useAuth } from "contexts/AuthContext";
import PageHeader from "components/PageHeader.js";
import { Helmet } from "react-helmet";
import UserBadge from "components/UserBadge";

export default function Location(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [location, setLocation] = useState();
  let { locationId } = useParams();
  const { database, userCredential } = useAuth();
  useEffect(() => {
    const query = database.doc(`locations/${locationId}`);
    query.get().then((doc) => {
      const data = doc.data();
      setLocation(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Loader
        className={`loader loader-page loader-${
          !isLoading ? "not-" : ""
        }visible`}
        visible={true}
      />
      {props.alert}
      {!isLoading && (
        <>
          <Helmet></Helmet>
          <div className="main-content">
            <PageHeader
              title={`${location.name}`}
              headerTitle={`LOCATION : ${location.name}`.toUpperCase()}
            />
            <br />
            <div
              className="card"
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                height: "auto",
                maxWidth: "auto",
                marginBottom: "12px",
                overflowWrap: "break-word",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                <div
                  className="flex flex-column"
                  style={{ paddingBottom: "12px", minWidth: "384px" }}
                >
                  <h2 style={{ margin: 0, padding: 0 }}>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        maxWidth: "100%",
                      }}
                    >
                      {location.name}
                      <UserBadge user={user} icon title />
                    </span>
                  </h2>
                  <p>{location.name}</p>
                </div>
                {user && props.user && user.username == props.user.username ? (
                  <>
                    <div
                      className="flex flex-column"
                      style={{ minWidth: "384px" }}
                    >
                      <Link exact to="/settings" className="button">
                        <Icon.AccountCircle />
                        <span>edit profile</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: "auto",
                  width: "100%",
                }}
              >
                <div
                  className="card"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    height: "100%",
                    maxWidth: " auto",
                    marginTop: "0px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: "100%",
                      height: "100%",
                    }}
                  >
                    <h2>about : me</h2>
                    <div className="flex flex-column">
                      <p>
                        {location.profile.description ||
                          "no description available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

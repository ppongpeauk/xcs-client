/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

// external imports
import Loader from "components/Loader";
import * as Icon from "@material-ui/icons";
import PageHeader from "components/PageHeader.js";

// authentication
import { useAuth } from "contexts/AuthContext";

export default function Locations(props) {
  const history = useHistory();
  // database stuff
  const { userCredential, database } = useAuth();
  const [user, setUser] = useState();
  const [userCache, setUserCache] = useState({});
  const [locations, setLocations] = useState({});
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    database.collection("locations").where("addedUsers", "array-contains", userCredential.uid)
      .get()
      .then((querySnapshot) => {
        let locationsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            const data = doc.data();
            locationsData.push(data);
          }
        });
        setLocations(locationsData);
        setLoading(false);
      });
  }, []);

  function getUsername(uid) {
    if (!userCache[uid]) {
      database.doc(`users/${uid}`).get().then((doc) => {
        if (doc.exists) {
          setUserCache({
            ...userCache,
            [uid]: doc.data().username
          });
        }
      })
    }
  }

  return (
    <div className="main-content">
      <Loader
        className={`loader loader-page loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      {props.alert}
      {!isLoading &&
        <>
          <PageHeader title="View Locations" headerTitle="locations" description={<Icon.Place />} />
          <br />
          <div style={{ height: "100%", width: "50%" }}>
            <Link exact to="/locations/create" className="button">
              <Icon.AddCircle />
              <span>create a new location</span>
            </Link>
            <br />
            <div className="card fill">
              <div className="card-contents">
                <table>
                  <tr className="tr-margin">
                    <th>location name</th>
                    <th>owned by</th>
                    <th>last modified</th>
                    <th>actions</th>
                  </tr>
                  {
                    locations.length > 0 ? locations.map((location) =>
                      <>
                        {
                          getUsername(location.ownerId)
                        }
                        <tr className="tr-margin">
                          <td>
                            <Link to={`/locations/${location.id}`}>
                              {location.name}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/profile/${userCache[location.ownerId]}`}>
                              {userCache[location.ownerId]}
                            </Link>
                          </td>
                          <td>{location.updatedAt.toDate().toDateString()}</td>
                          <td>
                            <Link to={`/locations/${location.id}`}><Icon.Create /></Link>
                          </td>
                        </tr>
                      </>
                    ) :
                      <>
                        <tr className="tr-margin">
                          <td colSpan="4" style={{ textAlign: "center" }}>no locations found! <span style={{ fontWeight: 500 }}><Link to="/locations/create" style={{ display: "inline" }}>create one!</Link></span></td>
                        </tr>
                      </>
                  }
                </table>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}
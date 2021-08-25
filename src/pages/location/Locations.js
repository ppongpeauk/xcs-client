/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory, useLocation, Link, Switch, Route } from "react-router-dom";

// external imports
import Loader from "components/Loader";
import * as Icon from "@material-ui/icons";
import PageHeader from "components/PageHeader.js";

// authentication
import { useAuth } from "contexts/AuthContext";

// pages
import Location from "pages/location/Location";
import LocationsCreate from "pages/location/LocationCreate";

export default function Locations(props) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const history = useHistory();
  const pageLocation = useLocation();
  // database stuff
  const { userCredential, database } = useAuth();
  const [user, setUser] = useState();
  const [userCache, setUserCache] = useState({});
  const [locations, setLocations] = useState({});
  const [filteredLocations, setFilteredLocations] = useState({});
  const [sortOption, setSortOption] = useState(["default", "asc"]);
  const [isLoading, setLoading] = useState(true);

  const nameFilterRef = useRef();

  function compare(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  async function filterList() {
    function sort(list) {
      var sortedFilteredList = [...list];
      if (sortOption[0] == "updatedAt") {
        sortedFilteredList.sort(function (a, b) {
          var dateA = a.updatedAt.toDate().toLocaleString()
          var dateB = b.updatedAt.toDate().toLocaleString()
          return sortOption[1] == "asc" ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
        })
      } else if (sortOption[0] == "name" || sortOption[0] == "default") {
        sortedFilteredList.sort((a, b) => {
          return (sortOption[1] == "asc" ? compare(a.name, b.name) : compare(b.name, a.name));
        });
      } else if (sortOption[0] == "ownedBy") {
        sortedFilteredList.sort((a, b) => {
          return (sortOption[1] == "asc" ? compare(userCache[a.ownerId][0], userCache[b.ownerId][0]) : compare(userCache[b.ownerId][0], userCache[a.ownerId][0]));
        });
      }
      return sortedFilteredList;
    }

    var filteredList = {};

    if (nameFilterRef.current) {
      if (!nameFilterRef.current.value) {
        setFilteredLocations(sort(locations));
      } else {
        // filter the list of entry points by the search term
        filteredList = locations.filter(function (location) {
          return (
            location.name.toLowerCase().indexOf(nameFilterRef.current.value.toLowerCase()) !== -1
          );
        });
        setFilteredLocations(sort(filteredList));
      }
    } else {
      setFilteredLocations(locations);
    }
  }

  async function refreshLocationsList() {
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
      });
  }

  async function setSortHandler(filterName) {
    if (sortOption[0] == filterName && sortOption[1] == "asc") {
      await setSortOption([filterName, "desc"]);
    } else if (sortOption[0] == filterName && sortOption[1] == "desc") {
      await setSortOption(["default", "asc"]);
    } else {
      await setSortOption([filterName, "asc"]);
    }
  }

  function getUsername(uid) {
    if (!userCache[uid]) {
      database.doc(`users/${uid}`).get().then((doc) => {
        if (doc.exists) {
          var data = doc.data();
          setUserCache({
            ...userCache,
            [uid]: [data.username, data.preferences.namePrivacy == "public" ? data.profile.name : `@${data.username}`]
          });
        }
      })
    }
  }

  useEffect(async () => {
    await filterList();
  }, [locations, sortOption]);

  useEffect(async () => {
    await refreshLocationsList();
    setLoading(false);
    if (pageLocation && pageLocation.state && pageLocation.state.error) {
      setError(pageLocation.state.error);
    }
  }, []);

  return (
    <>
      <Loader
        className={`loader loader-page loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      {success &&
        <>
          <alert className="success">
            <div>
              <p style={{ textAlign: "left" }}>{success}</p>
            </div>
          </alert>
          <br />
        </>
      }
      {error &&
        <>
          <alert className="danger">
            <div>
              <p style={{ textAlign: "left" }}>{error}</p>
            </div>
          </alert>
          <br />
        </>
      }
      {!isLoading &&
        <>
          <div className="main-content">
            <PageHeader title="View Locations" headerTitle="locations" description={<Icon.Place />} />
            <br />
            <div className="flex flex-row" style={{ alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
              <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "auto", width: "50%", marginRight: "4px", overflowWrap: "break-word", }}>
                <Link exact to="/locations/create" className="button" style={{ width: "100%", marginBottom: "4px" }}>
                  <Icon.AddCircle />
                  <span>create a new location</span>
                </Link>
                <div className="flex flex-row">
                  <input autocomplete="off" onChange={() => filterList()} ref={nameFilterRef} type="name" placeholder="filter by name" className="input-box" name="name" style={{ marginRight: "4px" }}></input>
                </div>
                <table style={{ width: "100%" }}>
                  <tr className="tr-group">
                    <th style={{ justifyContent: "center", alignItems: "center", width: "auto" }}>
                      <button className="button invisible" onClick={() => { setSortHandler("name") }} disabled={isLoading} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", border: "none", background: "transparent", height: "24px", width: "100%", padding: "0px" }}>
                        <p>name</p>
                        {
                          sortOption[0] === "name" && (
                            sortOption[1] === "asc" ? (
                              <Icon.ArrowDropUp />
                            ) : (
                              <Icon.ArrowDropDown />
                            )
                          )
                        }
                      </button>
                    </th>
                    <th style={{ justifyContent: "center", alignItems: "center", width: "auto" }}>
                      <button className="button invisible" onClick={() => { setSortHandler("ownedBy") }} disabled={isLoading} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", border: "none", background: "transparent", height: "24px", width: "100%", padding: "0px" }}>
                        <p>owned by</p>
                        {
                          sortOption[0] === "ownedBy" && (
                            sortOption[1] === "asc" ? (
                              <Icon.ArrowDropUp />
                            ) : (
                              <Icon.ArrowDropDown />
                            )
                          )
                        }
                      </button>
                    </th>
                    <th style={{ justifyContent: "center", alignItems: "center", width: "auto" }}>
                      <button className="button invisible" onClick={() => { setSortHandler("updatedAt") }} disabled={isLoading} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", border: "none", background: "transparent", height: "24px", width: "100%", padding: "0px" }}>
                        <p>modified</p>
                        {
                          sortOption[0] === "updatedAt" && (
                            sortOption[1] === "asc" ? (
                              <Icon.ArrowDropUp />
                            ) : (
                              <Icon.ArrowDropDown />
                            )
                          )
                        }
                      </button>
                    </th>
                    <th>actions</th>
                  </tr>
                  {
                    filteredLocations.length > 0 && (<>
                    {filteredLocations.map((location) =>
                      <>
                        {
                          getUsername(location.ownerId)
                        }
                        <tr className="tr-group">
                          <td>
                            <Link to={`/locations/${location.id}`}>
                              {location.name}
                            </Link>
                          </td>
                          <td>
                            <Link to={`/profile/${userCache[location.ownerId] && userCache[location.ownerId][0]}`}>
                              {userCache[location.ownerId] && userCache[location.ownerId][1]}
                            </Link>
                          </td>
                          <td>
                            <p>{location.updatedAt.toDate().toDateString()}</p>
                            <p>{location.updatedAt.toDate().toLocaleTimeString("en-US")}</p>
                          </td>
                          <td >
                            <Link style={{ padding: "4px" }} to={`/locations/${location.id}`}><Icon.Create/></Link>
                            <Link style={{ padding: "4px" }} to={`/entry-points/${location.id}`}><Icon.List /></Link>
                          </td>
                        </tr>
                      </>
                    )}
                    <td colSpan="4" style={{ textAlign: "center" }}><small style={{ textTransform: "uppercase", color: "var(--background-tertiary)" }}><hr />showing {filteredLocations.length} of {locations.length} total locations</small></td>
                    </>) 
                    || locations.length == 0 &&
                    <>
                      <tr className="tr-group">
                        <td colSpan="4" style={{ textAlign: "center" }}>no locations found! <span style={{ fontWeight: 500 }}><Link to="/locations/create" style={{ display: "inline" }}>create one!</Link></span></td>
                      </tr>
                    </>
                    || filteredLocations.length == 0 && <td colSpan="4" style={{ textAlign: "center" }}>no locations found matching your search criteria!</td>
                  }
                </table>
              </div>
              <div className="card" style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "center", height: "auto", width: "50%", marginLeft: "4px", overflowWrap: "break-word" }}>
                <Switch>
                  <Route exact path="/locations/create">
                    <LocationsCreate refreshLocationsList={refreshLocationsList} />
                  </Route>
                  <Route exact path="/locations/:locationId">
                    <Location refreshLocationsList={refreshLocationsList} />
                  </Route>
                  <Route>
                    <h2 style={{ color: "var(--background-tertiary)" }}>
                      select a location to view
                    </h2>
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}
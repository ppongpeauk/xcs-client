/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect, useState, useRef, useContext, createContext } from "react";
import { useParams, useHistory, Link, Switch, Route } from "react-router-dom";

// external imports
import Loader from "components/Loader";
import * as Icon from "@material-ui/icons";
import { useAuth } from "contexts/AuthContext";
import PageHeader from "components/PageHeader.js";
import { Helmet } from "react-helmet";
import UserBadge from "components/UserBadge";
import ReactTagInput from "@pathofdev/react-tag-input";

// locations
import CreateEntryPoint from "pages/entry/EntryCreate";
import EntryPoint from "pages/entry/Entry";

export default function Location(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [location, setLocation] = useState();

  const [entryPoints, setEntryPoints] = useState({});
  const [filteredEntryPoints, setFilteredEntryPoints] = useState({});
  const [sortOption, setSortOption] = useState(["default", "asc"]);

  const [tags, setTags] = useState([]);
  let { locationId, entryId } = useParams();
  const { database, userCredential } = useAuth();

  const [userCache, setUserCache] = useState({});

  const entryPointFilterRef = useRef();

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
      }
      return sortedFilteredList;
    }

    let tagChecker = (arr, target) => target.every(v => arr.includes(v));
    var filteredList = {};

    if (entryPointFilterRef.current) {
      if (!entryPointFilterRef.current.value && tags.length == 0) {
        setFilteredEntryPoints(sort(entryPoints));
      } else {
        // filter the list of entry points by the search term and list of tags
        filteredList = entryPoints.filter(function (entryPoint) {
          return (
            entryPoint.name.toLowerCase().indexOf(entryPointFilterRef.current.value.toLowerCase()) !== -1 &&
            tagChecker(entryPoint.tags, tags)
          );
        });
        setFilteredEntryPoints(sort(filteredList));
      }
    } else {
      setFilteredEntryPoints(entryPoints);
    }
  }

  async function refreshEntryPointsList() {
    await database.collection("entryPoints").where("locationId", "==", locationId)
      .get()
      .then(async (querySnapshot) => {
        let entryPointsData = [];
        await querySnapshot.forEach((doc) => {
          if (doc.exists) {
            const data = doc.data();
            entryPointsData.push(data);
          }
        });
        await setEntryPoints(entryPointsData);
        await filterList();
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

  useEffect(async () => {
    await filterList();
  }, [tags, entryPoints, sortOption]);

  useEffect(async () => {
    if (entryId) {
      const entry = await database.collection("entryPoints").doc(entryId).get().then(doc => {
        if (doc.exists) {
          locationId = doc.data().locationId;
        }
      }).catch(() => { // if the user doesn't have access to the entry point, redirect to not found
        history.push({ pathname: "/locations", state: { error: "you do not have access to this location." } });
      });
    }
    await database.doc(`locations/${locationId}`).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setLocation(data);
      } else {
        history.push("/not-found");
      }
    }).catch(() => { // if the user doesn't have access to the location, redirect to not found
      history.push({ pathname: "/locations", state: { error: "you do not have access to this location." } });
    });
    await refreshEntryPointsList();
    setLoading(false);
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
    <>
      <Loader
        className={`loader loader-page loader-${!isLoading ? "not-" : ""}visible`}
        visible={true}
      />
      {props.alert}
      {!isLoading && (
        <>
          <div className="main-content">
            <PageHeader title={`${location.name}`} headerTitle={`${location.name}`.toLowerCase()} description={<Icon.Place />} />
            <br />
            <div className="flex flex-row" style={{ alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
              <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "auto", width: "50%", marginRight: "4px", overflowWrap: "break-word", }}>
                <PageHeader headerTitle="view entry points" />
                <br />
                <Link exact to={`/entry-points/${locationId}/create`} className="button" style={{ width: "100%", marginBottom: "4px" }}>
                  <Icon.AddCircle />
                  <span>create a new entry point</span>
                </Link>
                <div className="flex flex-row">
                  <input autocomplete="off" onChange={() => filterList()} ref={entryPointFilterRef} type="name" placeholder="filter by name" className="input-box" name="name" style={{ marginRight: "4px" }}></input>
                </div>
                <div className="flex flex-row">
                  <ReactTagInput
                    inline={true}
                    maxTags={16}
                    allowUnique={false}
                    tags={tags}
                    placeholder="filter by tags"
                    editable={true}
                    readOnly={false}
                    removeOnBackspace={true}
                    onChange={(newTags) => setTags(newTags.sort())}
                  />
                </div>
                <div className="flex flex-row">
                  <button type="button" onClick={() => { }} disabled={isLoading} className="input-box submit-button button" style={{ height: "32px" }}>
                    mass action
                    <Icon.ArrowDropDown />
                  </button>
                </div>
                <table style={{ width: "100%" }}>
                  <tr className="tr-group">
                    <th style={{ width: "36px" }}><input id="c1" type="checkbox" /></th>
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
                    <th>tags</th>
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
                    filteredEntryPoints.length > 0 && (
                      <>
                        {filteredEntryPoints.map((entry) =>
                          <>
                            <tr className="tr-group">
                              <td>
                                <input id="c1" type="checkbox" />
                              </td>
                              <td>
                                <Link to={`/locations/${locationId}/${entry.id}`}>
                                  {entry.name}
                                </Link>
                              </td>
                              <td className="tag-list">
                                {
                                  entry.tags.sort().map((tag) => {
                                    return (
                                      <div class="react-tag-input__tag tag-pill">
                                        <div class="react-tag-input__tag__content">
                                          {tag}
                                        </div>
                                      </div>
                                    );
                                  })
                                }
                              </td>
                              <td>
                                <p>{entry.updatedAt.toDate().toDateString()}</p>
                                <p>{entry.updatedAt.toDate().toLocaleTimeString("en-US")}</p>
                              </td>
                              <td>
                                <Link style={{ padding: "4px" }} to={`/entry-points/${locationId}/${entry.id}`}><Icon.Create /></Link>
                              </td>
                            </tr>
                          </>
                        )}
                        <td colSpan="5" style={{ textAlign: "center" }}><small style={{ textTransform: "uppercase", color: "var(--background-tertiary)" }}><hr />showing {filteredEntryPoints.length} of {entryPoints.length} total entry points</small></td>
                      </>
                    )

                    || entryPoints.length == 0 &&
                    <>
                      <tr className="tr-group">
                        <td colSpan="5" style={{ textAlign: "center" }}>no entry points found! <span style={{ fontWeight: 500 }}><Link to={`/entry-points/${locationId}/create`} style={{ display: "inline" }}>create one!</Link></span></td>
                      </tr>
                    </>
                    || filteredEntryPoints.length == 0 && <td colSpan="5" style={{ textAlign: "center" }}>no entry points found matching your search criteria!</td>
                  }
                </table>
              </div>
              <div className="card" style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "center", height: "auto", width: "50%", marginLeft: "4px", overflowWrap: "break-word" }}>
                <Switch>
                  <Route path="/entry-points/:locationId/create">
                    <CreateEntryPoint refreshEntryPointsList={refreshEntryPointsList} />
                  </Route>
                  <Route path="/entry-points/:locationId/:entryId">
                    <EntryPoint refreshEntryPointsList={refreshEntryPointsList} />
                  </Route>
                  <Route>
                    <h2 style={{ color: "var(--background-tertiary)" }}>
                      select an entry point to view
                    </h2>
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

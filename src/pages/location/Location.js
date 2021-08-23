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

import CreateEntryPoint from "pages/entry/EntryCreate";
import EntryPoint from "pages/entry/Entry";

export default function Location(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [location, setLocation] = useState();

  const [entryPoints, setEntryPoints] = useState({});
  const [filteredEntryPoints, setFilteredEntryPoints] = useState({});

  const [tags, setTags] = useState([]);
  let { locationId, entryId } = useParams();
  const { database, userCredential } = useAuth();

  const [userCache, setUserCache] = useState({});

  const entryPointFilterRef = useRef();

  function filterList() {
    let tagChecker = (arr, target) => target.every(v => arr.includes(v));
    if (!entryPointFilterRef.current)
      return;
    var filteredList = {};
    if (!entryPointFilterRef.current.value && tags.length == 0) {
      setFilteredEntryPoints(entryPoints);
    } else {
      // filter the list of entry points by the search term and list of tags
      filteredList = entryPoints.filter(function (entryPoint) {
        return (
          entryPoint.name.toLowerCase().indexOf(entryPointFilterRef.current.value.toLowerCase()) !== -1 && 
          tagChecker(entryPoint.tags, tags)
        );
      });
      setFilteredEntryPoints(filteredList);
    }
  }

  async function refreshEntryPointsList() {
    await database.collection("entryPoints").where("locationId", "==", locationId)
      .get()
      .then((querySnapshot) => {
        let entryPointsData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            const data = doc.data();
            entryPointsData.push(data);
          }
        });
        setEntryPoints(entryPointsData);
        setFilteredEntryPoints(entryPointsData);
        filterList();
      });
  }

  useEffect(() => {
    filterList();
  }, [tags]);

  useEffect(async () => {
    if (entryId) {
      const entry = await database.collection("entryPoints").doc(entryId).get().then(doc => {
        if (doc.exists) {
          locationId = doc.data().locationId;
        }
      })
    }
    await database.doc(`locations/${locationId}`).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        setLocation(data);
      } else {
        history.push("/not-found");
      }
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
        className={`loader loader-page loader-${!isLoading ? "not-" : ""
          }visible`}
        visible={true}
      />
      {props.alert}
      {!isLoading && (
        <>
          <Helmet></Helmet>
          <div className="main-content">
            <PageHeader title={`${location.name}`} headerTitle={`${location.name}`.toLowerCase()} description={<Icon.Place />} />
            <br />
            <div className="flex flex-row" style={{ alignItems: "flex-start", justifyContent: "center", height: "100%" }}>
              <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: "auto", width: "50%", marginRight: "4px", overflowWrap: "break-word", }}>
                <Link exact to={`/locations/${locationId}/create`} className="button" style={{ width: "100%", marginBottom: "4px" }}>
                  <Icon.AddCircle />
                  <span>create a new entry point</span>
                </Link>
                <div className="flex flex-row">
                  <input autocomplete="off" onChange={() => filterList()} ref={entryPointFilterRef} type="name" placeholder="filter by name" className="input-box" name="name" style={{ marginRight: "4px" }}></input>
                  <ReactTagInput
                    inline={true}
                    maxTags={4}
                    allowUnique={false}
                    tags={tags}
                    placeholder="filter by tags"
                    editable={true}
                    readOnly={false}
                    removeOnBackspace={true}
                    onChange={(newTags) => setTags(newTags)}
                  />
                </div>
                <br />
                <table style={{ width: "100%" }}>
                  <tr className="tr-margin">
                    <th>entry point</th>
                    <th>tags</th>
                    <th>last modified</th>
                    <th>actions</th>
                  </tr>
                  {
                    filteredEntryPoints.length > 0 && filteredEntryPoints.map((entry) =>
                      <>
                        <tr className="tr-margin">
                          <td>
                            <Link to={`/locations/${locationId}/${entry.id}`}>
                              {entry.name}
                            </Link>
                          </td>
                          <td style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}>
                            {
                              entry.tags.map((tag) => {
                                return <span className="tag-pill">{tag}</span>;
                              })
                            }
                          </td>
                          <td>{entry.updatedAt.toDate().toDateString()}</td>
                          <td>
                            <Link to={`/locations/${locationId}/${entry.id}`}><Icon.Create /></Link>
                          </td>
                        </tr>
                      </>
                    )
                    || entryPoints.length == 0 &&
                    <>
                      <tr className="tr-margin">
                        <td colSpan="4" style={{ textAlign: "center" }}>no entry points found! <span style={{ fontWeight: 500 }}><Link to={`/locations/${locationId}/create`} style={{ display: "inline" }}>create one!</Link></span></td>
                      </tr>
                    </>
                    || filteredEntryPoints.length == 0 && <td colSpan="4" style={{ textAlign: "center" }}>no entry points found!</td>
                  }
                </table>
              </div>
              <div className="card card-fill-height" style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "center", height: "auto", width: "50%", marginLeft: "4px", overflowWrap: "break-word" }}>
                <Switch>
                  <Route path="/locations/:locationId/create">
                    <CreateEntryPoint refreshEntryPointsList={refreshEntryPointsList} />
                  </Route>
                  <Route path="/locations/:locationId/:entryId">
                    <EntryPoint refreshEntryPointsList={refreshEntryPointsList} />
                  </Route>
                  <Route>
                    <h2 style={{ color: "var(--background-tertiary)" }}>
                      click on an entry point to view
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

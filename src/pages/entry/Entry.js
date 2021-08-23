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

export default function Entry(props) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [location, setLocation] = useState();

  const [entryPoint, setEntryPoint] = useState(props.entryPoint);
  let { entryId } = useParams();
  const { database, userCredential } = useAuth();

  const nameRef = useRef();
  const enabledRef = useRef();
  const lockedRef = useRef();
  const [tags, setTags] = useState([]);


  async function refreshEntryPoint() {
    if (entryId) {
      const entry = await database.collection("entryPoints").doc(entryId).get().then(doc => {
        if (doc.exists) {
          setEntryPoint(doc.data());
          setTags(doc.data().tags);
        } else {
          history.push("/not-found");
        }
      })
    }
  }

  useEffect(async () => {
    setError(null);
    setSuccess(null);
    await refreshEntryPoint();
    setLoading(false);
  }, [entryId]);

  function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    setLoading(true);
    if (nameRef.current.value && (nameRef.current.value.length < 3 || nameRef.current.value.length > 32)) {
      setError("your entry point name must be between 3 and 32 characters!");
      setLoading(false);
      return;
    }
    for (var i = 0; i < tags.length; i++) {
      if (tags[i].length > 16 || tags[i].length < 3) {
        setError("tags must be between 3 and 16 characters!");
        setLoading(false);
        return;
      }
    }

    const entryPointRef = database.collection("entryPoints").doc(entryId);
    entryPointRef.update({
      "name": nameRef.current.value,
      "tags": tags,
      "preferences.enabled": enabledRef.current.checked,
      "preferences.locked": lockedRef.current.checked
    }).then(async () => {
      setSuccess("entry point updated!");
      props.refreshEntryPointsList(); // refresh locations list to show changes immediately
      await refreshEntryPoint().then(() => {
        window.scrollTo(0, 0);
        setLoading(false);
      })
    }).catch(() => {
      setError("there was a problem updating the entry point!");
      setLoading(false);
    });
  }

  return (
    <>
      {props.alert}
      {entryPoint && (
        <>
          <Helmet></Helmet>
          <div className="main-content">
            <PageHeader title={`${entryPoint.name}`} headerTitle={`${entryPoint.name}`.toLowerCase()} description={<Icon.Apps />} />
            {success &&
              <alert className="success">
                <div>
                  <p style={{ textAlign: "left" }}>{success}</p>
                </div>
              </alert>
            }
            {error &&
              <alert className="danger">
                <div>
                  <p style={{ textAlign: "left" }}>{error}</p>
                </div>
              </alert>
            }
            <form onSubmit={handleSubmit} style={{ border: "none", boxShadow: "none" }}>
              <div className="flex flex-column" style={{ alignItems: "flex-start", justifyContent: "flex-start", height: "100%" }}>
                <div>
                  <h2 style={{ color: "var(--background-tertiary)", fontWeight: 300 }}>info</h2>
                  <div className="input-row">
                    <div className="input-group">
                      <label key={entryPoint.name}>
                        <p>name</p>
                        <input ref={nameRef} autocomplete="off" required type="name" placeholder="name" className="input-box" name="name" defaultValue={entryPoint.name} ></input>
                      </label>
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>
                        <p>tags</p>
                        <ReactTagInput
                          inline={true}
                          maxTags={4}
                          tags={tags}
                          placeholder="enter a tag"
                          editable={true}
                          readOnly={false}
                          removeOnBackspace={true}
                          onChange={(newTags) => setTags(newTags)}
                        />
                      </label>
                    </div>
                  </div>
                  <h2 style={{ color: "var(--background-tertiary)", fontWeight: 300 }}>entry states</h2>
                  <div className="input-row">
                    <div className="input-group" style={{ paddingRight: "0.5em" }}>
                      <label class="switch" key={entryPoint.preferences.enabled}>
                        <p>enabled</p>
                        <input ref={enabledRef} className="checkbox" type="checkbox" defaultChecked={entryPoint.preferences.enabled} />
                        <div>
                          <span></span>
                        </div>
                      </label>
                    </div>
                    <div className="input-group" style={{ paddingLeft: "0.5em" }}>
                      <label class="switch" key={entryPoint.preferences.locked}>
                        <p>locked</p>
                        <input ref={lockedRef} className="checkbox" type="checkbox" defaultChecked={entryPoint.preferences.locked} />
                        <div>
                          <span></span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="input-row">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", width: "100%", marginTop: "6px" }}>
                      <button type="submit" disabled={isLoading} className="input-box submit-button button" style={{ width: "100%" }}>
                        <Icon.CheckCircle />
                        <span>save changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      )
      }
    </>
  );
}

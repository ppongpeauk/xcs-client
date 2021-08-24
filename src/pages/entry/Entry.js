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
import Modal from "react-modal";

import CreateEntryPoint from "pages/entry/EntryCreate";

// authentication
import firebase from "firebase";

export default function Entry(props) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [submitType, setSubmitType] = useState(1);

  const [entryPoint, setEntryPoint] = useState(props.entryPoint);
  let { entryId } = useParams();
  const { database, userCredential } = useAuth();

  const nameRef = useRef();
  const enabledRef = useRef();
  const lockedRef = useRef();
  const [tags, setTags] = useState([]);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  async function refreshEntryPoint() {
    if (entryId) {
      const entry = await database.collection("entryPoints").doc(entryId).get().then(doc => {
        if (doc.exists) {
          setEntryPoint(doc.data());
          setTags(doc.data().tags.sort());
        } else {
          history.push("/not-found");
        }
      })
    }
  }

  useEffect(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    await refreshEntryPoint();
    setLoading(false);
  }, [entryId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitType == 1) { // save changes
      setError(null); setSuccess(null);
      setLoading(true);
      if (nameRef.current.value && (nameRef.current.value.length < 3 || nameRef.current.value.length > 32)) {
        setError("your entry point name must be between 3 and 32 characters!");
        setLoading(false);
        return;
      }
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].length > 16 || tags[i].length < 3) {
          setError("tag names must be between 3 and 16 characters!");
          setLoading(false);
          return;
        }
      }

      await database.collection("entryPoints").doc(entryId).update({
        "name": nameRef.current.value,
        "tags": tags,
        "preferences.enabled": enabledRef.current.checked,
        "preferences.locked": lockedRef.current.checked,
        "updatedAt": firebase.firestore.FieldValue.serverTimestamp()
      }).then(async () => {
        setSuccess("entry point updated!");
        await refreshEntryPoint().then(() => {
          window.scrollTo(0, 0);
          props.refreshEntryPointsList(); // refresh locations list to show changes immediately
          setLoading(false);
        })
      }).catch(() => {
        setError("there was a problem updating the entry point!");
        setLoading(false);
      });
    } else if (submitType == 2) { // delete entry point modal
      setDeleteModalOpen(true);
    } else if (submitType == 3) { // delete entry point
      setError(null); setSuccess(null);
      setLoading(true);
      database.collection("entryPoints").doc(entryId).delete().then(() => {
        props.refreshEntryPointsList(); // refresh locations list to show changes immediately
        setLoading(false);
        history.push(`/locations/${entryPoint.locationId}`);
      }).catch(() => {
        setError("there was a problem deleting the entry point!");
        setLoading(false);
        setDeleteModalOpen(false);
      });
    }
  }

  return (
    <>
      {entryPoint && (
        <>
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
            <Modal
              isOpen={isDeleteModalOpen}
              onRequestClose={() => setDeleteModalOpen(false)}
              style={{
                overlay: {
                  transition: "var(--transition-duration-primary)",
                  background: "none",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                content: {
                  padding: "0px",
                  background: "transparent",
                  border: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "none"
                }
              }}
            >
              <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", width: "100%", height: "100%", padding: "16px" }}>
                <PageHeader headerTitle={`delete ${entryPoint.name}`} description={<Icon.DeleteSweep />} />
                <p>are you sure you'd like to delete this entry point?</p>
                <br />
                <form onSubmit={handleSubmit} style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <button type="submit" onClick={() => { setSubmitType(3) }} disabled={isLoading} className="input-box submit-button button button-danger" style={{ marginRight: "0.5em", height: "2.5em" }}>
                      yes
                      <Icon.DeleteSweep />
                    </button>
                    <button className="button" onClick={() => { setDeleteModalOpen(false); }} style={{ height: "2.5em" }}>
                      nevermind
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
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
                          maxTags={16}
                          allowUnique={false}
                          tags={tags}
                          placeholder="add tag"
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
                    <div className="input-group" style={{ paddingRight: "0.5em" }} key={entryPoint.preferences.enabled}>
                      <label for="enabled"><p>enabled</p></label>
                      <input ref={enabledRef} id="enabled" type="checkbox" class="switch" defaultChecked={entryPoint.preferences.enabled} />
                    </div>
                  </div>
                  <div className="input-row">
                    <div className="input-group" style={{ paddingRight: "0.5em" }} key={entryPoint.preferences.locked}>
                      <label for="locked"><p>locked</p></label>
                      <input ref={lockedRef} id="locked" type="checkbox" class="switch" defaultChecked={entryPoint.preferences.locked} />
                    </div>
                  </div>
                  <div className="input-row">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", minWidth: "48px", marginTop: "6px", marginLeft: "0.5em" }}>
                      <button type="submit" onClick={() => { setSubmitType(1) }} disabled={isLoading} className="input-box submit-button button" style={{ width: "100%" }}>
                        <Icon.CheckCircle />
                        <span>save changes</span>
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", minWidth: "48px", marginTop: "6px", marginLeft: "0.5em" }}>
                      <button type="submit" onClick={() => { setSubmitType(2) }} disabled={isLoading} className="input-box submit-button button button-danger" style={{ width: "100%" }}>
                        <Icon.DeleteSweep />
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

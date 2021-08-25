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
import ReactTooltip from "react-tooltip";

import Createlocation from "pages/entry/EntryCreate";

// authentication
import firebase from "firebase";

export default function Location(props) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [submitType, setSubmitType] = useState(1);
  const [locationData, setLocationData] = useState({});

  let { locationId } = useParams();
  const { database, userCredential } = useAuth();

  const nameRef = useRef();
  const enabledRef = useRef();

  const confirmDeleteRef = useRef();
  const [confirmDeleteDisabled, setConfirmDeleteDisabled] = useState(true);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  async function refreshLocation() {
    if (locationId) {
      const entry = await database.collection("locations").doc(locationId).get().then(doc => {
        if (doc.exists) {
          setLocationData(doc.data());
        } else {
          history.push("/not-found");
        }
      }).catch(() => {
        history.push({ pathname: "/locations", state: { error: "you do not have access to this location." } });
      });
    }
  }

  useEffect(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    await refreshLocation();
    setLoading(false);
  }, [locationId]);

  function onConfirmDeleteChange() {
    setConfirmDeleteDisabled(confirmDeleteRef.current.value != locationData.name);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitType == 1) { // save changes
      setError(null); setSuccess(null);
      setLoading(true);
      if (nameRef.current.value && (nameRef.current.value.length < 3 || nameRef.current.value.length > 32)) {
        setError("your location name must be between 3 and 32 characters!");
        setLoading(false);
        return;
      }

      await database.collection("locations").doc(locationId).update({
        "name": nameRef.current.value,
        "updatedAt": firebase.firestore.FieldValue.serverTimestamp()
      }).then(async () => {
        setSuccess("location updated!");
        await refreshLocation().then(() => {
          window.scrollTo(0, 0);
          props.refreshLocationsList(); // refresh locations list to show changes immediately
          setLoading(false);
        })
      }).catch(() => {
        setError("there was a problem updating the location!");
        setLoading(false);
      });
    } else if (submitType == 2) { // delete location modal
      setDeleteModalOpen(true);
    } else if (submitType == 3) { // delete location
      setError(null); setSuccess(null);
      setLoading(true);
      await database.collection("entryPoints").where("locationId", "==", locationId).get().then(async (docs) => {
        docs.forEach(doc => {
          doc.ref.delete();
        });
      }).catch(() => {
        setError("there was a problem deleting the location!");
        setLoading(false);
        setDeleteModalOpen(false);
      });
      await database.collection("locations").doc(locationId).delete().then(async () => {
        props.refreshLocationsList(); // refresh locations list to show changes immediately
        setLoading(false);
        history.push("/locations/");
      }).catch(() => {
        setError("there was a problem deleting the location!");
        setLoading(false);
        setDeleteModalOpen(false);
      });
    }
  }

  return (
    <>
      {locationData && (
        <>
          <div className="main-content">
            <PageHeader title={`${locationData.name}`} headerTitle={`${locationData.name}`.toLowerCase()} description={<Icon.Domain />} />
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
                  backdropFilter: "blur(4px)",
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
              <div className="card" style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", width: "100%", height: "100%", padding: "20px" }}>
                <PageHeader headerTitle={`delete ${locationData.name}?`} />
                <p>are you sure you would like to delete this location?</p>
                <strong>this action is irreversible.</strong>
                <br />
                <form onSubmit={handleSubmit} style={{ background: "transparent", border: "none", boxShadow: "none" }}>
                  <p>type <strong>{locationData.name}</strong> below to confirm.</p>
                  <div className="input-group">
                    <label key={confirmDeleteRef}>
                      <input ref={confirmDeleteRef} onChange={() => onConfirmDeleteChange()} autocomplete="off" required type="name" placeholder={locationData.name} className="input-box" name="name" ></input>
                    </label>
                  </div>
                  <div className="input-group" style={{ display: "flex", flexDirection: "row" }}>
                    <button type="submit" onClick={() => { setSubmitType(3) }} disabled={isLoading || confirmDeleteDisabled} className="input-box submit-button button button-danger" style={{ marginRight: "0.5em", height: "2.5em" }}>
                      less go
                      <img src="https://cdn.restrafes.co/xcs/dababy-spin.gif" style={{ padding: "4px", height: "100%" }} />
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
                      <label key={locationData.name}>
                        <p>name</p>
                        <input ref={nameRef} autocomplete="off" required type="name" placeholder="name" className="input-box" name="name" defaultValue={locationData.name} ></input>
                      </label>
                    </div>
                    <div className="input-group">
                      <label key={locationData.experienceId}>
                        <p>experience <span data-tip data-for="experienceTip"><Icon.Help style={{ fontSize: "16px" }} /></span></p>
                        <input autocomplete="off" disabled type="name" placeholder="experience id" className="input-box" name="name" defaultValue={locationData.experienceId || "none"} ></input>
                        <ReactTooltip id="experienceTip" place="right" effect="solid">
                          <h2>about experience locking</h2>
                          <p>your location's experience is automatically locked to the first experience that uses this location's API credentials</p>
                          <strong>contact customer service if you've accidentally used the wrong place.</strong>
                        </ReactTooltip>
                      </label>
                    </div>
                  </div>
                  <h2 style={{ color: "var(--background-tertiary)", fontWeight: 300 }}>states</h2>
                  <div className="input-row">
                    <div className="input-group" style={{ paddingRight: "0.5em" }} key={locationData.id}>
                      <label for="enabled"><p>active</p></label>
                      <input ref={enabledRef} id="enabled" type="checkbox" class="switch" defaultChecked={locationData.id} />
                    </div>
                  </div>
                  <div className="input-row" style={{ maxHeight: "48px", marginTop: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", minWidth: "48px", marginLeft: "0.5em" }}>
                      <button type="submit" onClick={() => { setSubmitType(1) }} disabled={isLoading} className="input-box submit-button button" style={{ width: "100%" }}>
                        <Icon.CheckCircle />
                        <span>save changes</span>
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", minWidth: "48px", marginLeft: "0.5em" }}>
                      <button type="submit" onClick={() => { setSubmitType(4) }} disabled={isLoading} className="input-box submit-button button" style={{ width: "100%" }}>
                        <Icon.GetApp />
                        <span>download kit</span>
                      </button>
                    </div>
                    {
                      locationData.ownerId == userCredential.uid &&
                      <>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", minWidth: "48px", marginLeft: "0.5em" }}>
                          <button type="submit" onClick={() => { setSubmitType(2) }} disabled={isLoading} className="input-box submit-button button button-danger" style={{ width: "100%" }}>
                            <Icon.DeleteSweep />
                          </button>
                        </div>
                      </>
                    }
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

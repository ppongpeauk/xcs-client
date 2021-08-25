/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

// external imports
import Loader from "components/Loader";
import * as Icon from "@material-ui/icons";
import PageHeader from "components/PageHeader.js";

// authentication
import firebase from "firebase";
import { useAuth } from "contexts/AuthContext";

export default function LocationsCreate(props) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  // database stuff
  const { userCredential, database } = useAuth();
  const [namePlaceholder, setNamePlaceholder] = useState();
  const [isLoading, setLoading] = useState(true);

  const history = useHistory();

  const nameRef = useRef();
  const ownerRef = useRef();
  const descriptionRef = useRef();

  function generatePlaceholderName() {
    var hri = require('human-readable-ids').hri;
    return hri.random();
  }

  function createLocId() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 16; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  useEffect(() => {
    console.log("trigger")
    setLoading(false);
    setNamePlaceholder(generatePlaceholderName());
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    setLoading(true);
    if (nameRef.current.value && nameRef.current.value.length < 3) {
      setError("your location name must be at least 3 characters long!");
      setLoading(false);
      return;
    }
    if (descriptionRef.current.value.length > 1024) {
      setError("your location description must be less than 1024 characters long!");
      setLoading(false);
      return;
    }
    if (ownerRef.current.value != userCredential.uid) { // change when organizations are implemented
      setError("you must be the owner of this location!");
      setLoading(false);
      return;
    }
    const generatedId = createLocId();
    database.collection("locations").doc(generatedId).set({
      "name": nameRef.current.value || namePlaceholder,
      "id": generatedId,
      "addedUsers": [ownerRef.current.value],
      "ownerId": ownerRef.current.value,
      "experienceId": null,
      "profile": {
        "description": descriptionRef.current.value || "No description available."
      },
      "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
      "updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      setSuccess("successfully created a location!");
      props.refreshLocationsList();
      setLoading(false);
    }).catch((err) => {
      setError("there was an error while creating your location! please try again later.");
      setLoading(false);
    })
  }

  return (
    <div className="main-content">
      {!isLoading &&
        <>
          <PageHeader title="Create Location" headerTitle="create location" description={<Icon.AddCircle />} />
          {success &&
            <alert className="success">
              <div>
                <h2 style={{ textAlign: "left" }}>SUCCESS</h2>
                <p style={{ textAlign: "left" }}>{success}</p>
              </div>
            </alert>
          }
          {error &&
            <alert className="danger">
              <div>
                <h2 style={{ textAlign: "left" }}>ERROR</h2>
                <p style={{ textAlign: "left" }}>{error}</p>
              </div>
            </alert>
          }
          <form onSubmit={handleSubmit} style={{ border: "none", boxShadow: "none" }}>
            <div>
              <div className="flex flex-row">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "100%" }}>
                  <div className="flex flex-column flex-align-left-h" style={{ width: "auto", height: "100%", marginRight: "12px", marginLeft: "12px" }}>
                    <label>
                      <p>name</p>
                      <input ref={nameRef} type="name" placeholder={namePlaceholder} className="input-box" name="name"></input>
                    </label>
                    <label>
                      <p>location owner</p>
                      <select ref={ownerRef} name="owner" className="input-box" defaultValue={userCredential.uid}>
                        <option value={userCredential.uid}>me</option>
                      </select>
                    </label>
                    <label>
                      <p>description</p>
                      <textarea ref={descriptionRef} placeholder="no description available." className="input-box" id="profile-about" style={{ resize: "none", flex: 1, height: "auto", width: "100%" }}></textarea>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="input-box submit-button button" style={{ width: "100%" }}>
              <Icon.AddCircle />
              <span>create location</span>
            </button>
          </form>
        </>
      }
    </div>
  )
}
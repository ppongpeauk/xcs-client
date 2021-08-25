/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

// external imports
import Loader from "components/Loader";
import * as Icon from "@material-ui/icons";
import PageHeader from "components/PageHeader.js";
import ReactTagInput from "@pathofdev/react-tag-input";

// authentication
import firebase from "firebase";
import { useAuth } from "contexts/AuthContext";

export default function EntryCreate(props) {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  // database stuff
  const { userCredential, database } = useAuth();
  const [namePlaceholder, setNamePlaceholder] = useState();
  const [isLoading, setLoading] = useState(true);

  const history = useHistory();

  let { locationId } = useParams();
  const [tags, setTags] = useState([]);

  const nameRef = useRef();
  const ownerRef = useRef();

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
    setLoading(false);
    setNamePlaceholder(generatePlaceholderName());
  }, []);
  
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

    // // check if a location with the same name already exists
    // database.collection("entryPoints").where("name", "in", [nameRef.current.value, namePlaceholder]).get().then((data) => {
    //   if (data.size > 0) {
    //     setError("an entry point with that name under this location already exists, please choose another name!");
    //     setLoading(false);
    //     return;
    //   } else {
    //     createEntryPoint();
    //   }
    // }).catch(err => {
    //   setError("there was an error while trying to create an entry point! please try again later. " + err);
    //   setLoading(false);
    //   return;
    // });

    const generatedId = createLocId();
    database.collection("entryPoints").doc(generatedId).set({
      "name": nameRef.current.value || namePlaceholder,
      "id": generatedId,
      "locationId": locationId,
      "tags": tags,
      "preferences": {
        "enabled": true,
        "locked": true,
        "addedUsers": {},
        "addedUserGroups": {},
        "addedGroups": {},
      },
      "createdAt": firebase.firestore.FieldValue.serverTimestamp(),
      "updatedAt": firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      setSuccess("successfully created an entry point!");
      setTags([]);
      setNamePlaceholder(generatePlaceholderName());
      props.refreshEntryPointsList();
      setLoading(false);
    }).catch((err) => {
      setError(`there was an error while creating your entry point! please try again later. (${err.code})`);
      setLoading(false);
    })
  }

  return (
    <div className="main-content">
      {props.alert}
      {!isLoading &&
        <>
          <PageHeader title="Create Entry" headerTitle="create entry point" description={<Icon.AddCircle />} />
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
            <div style={{ width: "100%" }}>
              <div className="flex flex-row">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "100%" }}>
                  <div className="flex flex-column flex-align-left-h" style={{ width: "auto", height: "100%", marginRight: "12px", marginLeft: "12px" }}>
                    <label>
                      <p>name</p>
                      <input autocomplete="off" ref={nameRef} type="name" placeholder={namePlaceholder} className="input-box" name="name"></input>
                    </label>
                    <label>
                      <p>tags</p>
                      <ReactTagInput
                        inline={true}
                        maxTags={4}
                        tags={tags}
                        placeholder="tags"
                        editable={true}
                        readOnly={false}
                        removeOnBackspace={true}
                        onChange={(newTags) => setTags(newTags.sort())}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", width: "100%", marginTop: "6px" }}>
              <button type="submit" disabled={isLoading} className="input-box submit-button button" style={{ width: "100%" }}>
                <Icon.AddCircle />
                <span>create entry point</span>
              </button>
            </div>
          </form>
        </>
      }
    </div>
  )
}
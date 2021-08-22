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
import PageHeader from "components/PageHeader";
import defaultProfileImage from "components/default_profile_image.png";
import * as Icon from '@material-ui/icons';
import * as imageConversion from 'image-conversion';

// authentication
import { useAuth } from "contexts/AuthContext";
import { useUser } from "contexts/UserContext";
import { storage } from "firebase.js";

const isImage = require("is-image");

export default function Settings() {
  const [isLoading, setLoading] = useState(true);

  const [profileImagePreviewFile, setProfileImagePreviewFile] = useState();
  const [profileImagePreviewProcessed, setProfileImagePreviewProcessed] = useState();
  const [profileImagePreviewProcessedExt, setProfileImagePreviewProcessedExt] = useState();

  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const { userCredential, database } = useAuth();
  const { userProfile, refreshUserProfile } = useUser();

  const history = useHistory();

  const nameRef = useRef();
  const emailRef = useRef();
  const aboutRef = useRef();
  const websiteRef = useRef();
  const namePrivacyRef = useRef();
  const usernameRef = useRef();
  const profileImageRef = useRef();
  const specialTitleRef = useRef();

  useEffect(() => {
    setLoading(false);
  }, []);

  function resetProfileImagePreview(e) {
    e.preventDefault();
    setProfileImagePreviewProcessed(defaultProfileImage);
    setProfileImagePreviewFile(null);
  }

  function handleSendVerificationEmail(e) {
    e.preventDefault();
    setSuccess(null); setError(null);
    userCredential.sendEmailVerification().then(() => {
      setSuccess("verification email sent. check your inbox!");
    }).catch(() => {
      setError("verification email failed to send!");
    })
  }

  const handleProfileImagePreview = (e) => {
    const reader = new FileReader();
    let getFile = null;
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImagePreviewFile(getFile);
        setProfileImagePreviewProcessed(reader.result);
      }
    };
    try {
      if (e.target.files.length === 1) {
        getFile = e.target.files[0];
        const fileExt = getFile.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (isImage(getFile.name)) {
          setProfileImagePreviewProcessedExt(fileExt[1]);
          reader.readAsDataURL(getFile)
        }
      }
    } catch (e) {
      setError("invalid file!");
    }
  }

  function getFileSize(file) {
    return file.size;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); setSuccess(null);
    setLoading(true);
    if (nameRef.current.value.length < 3) {
      setError("your name must be at least 3 characters long!");
      setLoading(false);
      return;
    }
    if (aboutRef.current.value.length > 1024) {
      setError("your about me must be less than 1024 characters long!");
      setLoading(false);
      return;
    }
    if (specialTitleRef.current && specialTitleRef.current.value.length > 24) {
      setError("your special title must be less than 24 characters long!");
      setLoading(false);
      return;
    }
    const userInfoRef = database.collection("users").doc(userCredential.uid);

    function updateProfile(profileImageUrl) {
      userInfoRef.update({
        "elevationName": (userProfile.elevation >= 4) ? specialTitleRef.current.value : userProfile.elevationName,
        "profile.name": nameRef.current.value,
        "profile.website": websiteRef.current.value,
        "profile.about": (aboutRef.current.value.length > 0) ? aboutRef.current.value : null,
        "profile.avatar": profileImageUrl || userProfile.profile.avatar,
        "preferences.namePrivacy": (namePrivacyRef.current.value === "public") ? "public" : "private",
      }).then(() => {
        setSuccess("profile updated!");
        refreshUserProfile().then(() => {
          window.scrollTo(0, 0);
          setLoading(false);
        })
      }).catch(() => {
        setError("there was a problem updating your profile!");
        setLoading(false);
      });
    }

    async function uploadToStorage(result, filteredExt) {
      await storage.ref(`users/` + userCredential.uid + `/avatar.${filteredExt}`).put(result).on(
        "state_change",
        snapshot => { },
        error => { setError("there was a problem uploading your profile picture!"); setLoading(false); return; },
        () => {
          storage
            .ref("users/" + userCredential.uid)
            .child(`avatar.${filteredExt}`)
            .getDownloadURL()
            .then(url => {
              updateProfile(url);
            });
        }
      )
    }

    // profile picture compression
    if (profileImagePreviewFile) {
      if (getFileSize(profileImagePreviewFile) > 8e6) {
        setError("your profile picture must be less than 8mb!");
        setLoading(false);
        return;
      } else {
        const filteredExt = (profileImagePreviewProcessedExt !== "gif" ? "png" : "gif").toLowerCase(); // png if anything other than a gif, otherwise gif
        if (filteredExt !== "gif") {
          await imageConversion.compressAccurately(profileImagePreviewFile, {
            size: 512,
            accuracy: 0.9,
            type: `image/${filteredExt}`,
            width: 512,
            height: 512,
            orientation: 1,
            scale: 1,
          }).then(async result => {
            await uploadToStorage(result, filteredExt);
          }).catch(() => {
            setError("there was a problem uploading your profile picture!"); setLoading(false); return;
          });
        } else { // upload gifs as it is without it being passed for compression
          await uploadToStorage(profileImagePreviewFile, filteredExt);
        }
      }
    } else {
      updateProfile(defaultProfileImage === profileImagePreviewProcessed ? "https://cdn.restrafes.co/xcs/default_profile_image.png" : null);
    }
  }
  return (
    <>
      <Loader
        className={`loader loader-page loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      <div className="main-content">
        <PageHeader title="Preferences" headerTitle="PREFERENCES" description="beep boop" />
        <br />
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
          <div class="flex flex-row" style={{ width: "fit-content" }}>
            <div className="card" style={{ width: "100%", height: "auto", marginRight: "16px" }}>
              <h2>PROFILE</h2>
              <br />
              <div className="flex flex-row">
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", width: "100%" }}>
                  <div className="flex flex-row" style={{ marginBottom: "12px" }}>
                    <div className="flex flex-column flex-align-left-h" style={{ width: "128px", height: "128px", marginRight: "12px", marginLeft: "12px" }}>
                      {
                        <img src={profileImagePreviewProcessed || userProfile.profile.avatar || defaultProfileImage} style={{ height: "100%" }} className="profile-image" draggable={false} />
                      }

                    </div>
                    <div className="flex flex-column flex-align-center" style={{ maxWidth: "auto", marginRight: "12px", marginLeft: "12px" }}>
                      {
                        (
                          <>
                            <input type="button" id="file-upload" type="file" ref={profileImageRef} accept="image/*" onChange={handleProfileImagePreview} />
                            <label for="file-upload" className="input-box button-file-upload" style={{ width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                              choose file
                            </label>
                          </>
                        )
                      }
                      <button type="button" className="input-box button" disabled={(!profileImagePreviewProcessed && userProfile.profile.avatar === "https://cdn.restrafes.co/xcs/default_profile_image.png") || profileImagePreviewProcessed === defaultProfileImage} onClick={(e) => resetProfileImagePreview(e)} style={{ width: "100%", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                        use default avatar
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-column flex-align-left-h" style={{ width: "auto", height: "100%", marginRight: "12px", marginLeft: "12px" }}>
                    <label>
                      <p>name & visibility</p>
                      <input ref={nameRef} type="name" placeholder="name" className="input-box" name="name" defaultValue={userProfile.profile.name} ></input>
                      <select ref={namePrivacyRef} name="cars" className="input-box" defaultValue={userProfile.preferences.namePrivacy || "public"}>
                        <option value="public">public</option>
                        <option value="private">only me</option>
                      </select>
                    </label>
                    <label>
                      <p>about me</p>
                      <textarea ref={aboutRef} placeholder="no description available." className="input-box" id="profile-about" style={{ resize: "none", flex: 1, height: "auto", width: "100%" }}>
                        {userProfile.profile.about}
                      </textarea>
                    </label>
                    <label>
                      <p>website</p>
                      <input ref={websiteRef} type="text" placeholder="e.g. https://example.com" className="input-box" name="text" defaultValue={userProfile.profile.website} ></input>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card" style={{ width: "100%", height: "auto", paddingLeft: "24px", paddingRight: "24px", marginRight: "16px" }}>
              <h2>ACCOUNT</h2>
              <br />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", maxWidth: "512px" }}>
                <label>
                  <p>username</p>
                  <input ref={usernameRef} type="name" disabled={true} placeholder="name" className="input-box" name="name" defaultValue={userProfile.username} ></input>
                </label>
                <label>
                  <p>email</p>
                  <input ref={emailRef} type="email" placeholder="email" className="input-box" name="name" defaultValue={userCredential.email} ></input>
                  {
                    !userCredential.emailVerified &&
                    <button type="button" disabled={isLoading} onClick={(e) => handleSendVerificationEmail(e)} className="input-box button" style={{ width: "auto" }}>
                      <Icon.Send />
                      <span>send verification email</span>
                    </button>
                  }
                </label>
              </div>
            </div>
            {
              userProfile.elevation >= 4 &&
              <>
                <div className="card" style={{ width: "100%", height: "auto", paddingLeft: "24px", paddingRight: "24px" }}>
                  <h2 className={`special-gradient-${userProfile.elevation}`}>SPECIAL</h2>
                  <br />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", maxWidth: "512px" }}>
                    {
                      (userProfile.elevation >= 4) && <>
                        <label>
                          <p>user title</p>
                          <input ref={specialTitleRef} type="text" placeholder="special title" className="input-box" name="specialTitle" defaultValue={userProfile.elevationName} ></input>
                        </label>
                      </>
                    }
                  </div>
                </div>
              </>
            }
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", maxWidth: "512px", marginTop: "6px" }}>
            <button type="submit" disabled={isLoading} className="input-box submit-button button" style={{ width: "auto" }}>
              <Icon.Done />
              <span>enact changes</span>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
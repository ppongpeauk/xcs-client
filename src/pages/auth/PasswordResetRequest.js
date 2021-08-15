/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
*/

// core imports
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// external imports
import PageHeader from "../../components/PageHeader.js";
import Loader from "../../components/Loader";
import * as Icon from '@material-ui/icons';

// authentication
import { useAuth } from "../../contexts/AuthContext";

export default function PasswordResetRequest() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [message, setMessage] = useState();

  const emailRef = useRef();

  const { resetPassword } = useAuth();
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!(emailRef.current.value)) {
      return setError("please enter your email.");
    }
    try {
      setError(null);
      setMessage(null);
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("check your inbox for further instructions!")
    } catch (e) {
      let errorMessage = null;
      switch (e.code) {
        case "auth/invalid-email":
          errorMessage = "the email address you entered is invalid. please try again.";
          break;
        case "auth/user-not-found":
          errorMessage = "unable to find a user with that email address.";
          break;
        default:
          errorMessage = "there was a problem while trying to perform the requested action. please try again later.";
          break;
      }
      setError(errorMessage);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="eve">
      <PageHeader title="Recover Account" />
      <Loader
        className={`loader loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      <form onSubmit={handleSubmit} className="center-to-screen form-auth" style={{ display: "flex", flexDirection: "column", height: "auto", justifyContent: "center", alignItems: "center", maxWidth: "15vw", minWidth: "300px" }}>
        <h1>{process.env.REACT_APP_APP_TITLE}</h1>
        <h2>/ RECOVER ACCOUNT</h2>
        <br/>
        {error &&
          <alert className="danger">
            <div>
              <h2 style={{textAlign: "left"}}>ERROR</h2>
              <p style={{textAlign: "left", width: "100%"}}>{error}</p>
            </div>
          </alert>
        }
        {message &&
          <alert className="success">
            <div>
              <h2 style={{textAlign: "left"}}>SUCCESS</h2>
              <p style={{textAlign: "left", width: "100%"}}>{message}</p>
            </div>
          </alert>
        }
        <div className="flex flex-column" style={{ width: "auto" }}>
          <input ref={emailRef} type="email" placeholder="email" className="input-box" name="email"></input>
          <button type="submit" disabled={isLoading} className="input-box submit-button button">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span>recover</span>
              <Icon.ChevronRight style={{ paddingLeft: "0.25rem" }} />
            </div>
          </button>
        </div>
        <div style={{marginBottom: "0.25rem"}}>
          <Link to="/login" className="button-hover-underline flex-align-center"><Icon.ChevronLeft /> <b>return to login</b></Link>
        </div>
      </form>
    </div>
  );
}
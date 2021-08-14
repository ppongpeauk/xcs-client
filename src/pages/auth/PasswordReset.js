/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useRef, useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

// external imports
import PageHeader from "../../components/PageHeader.js";
import * as Icon from '@material-ui/icons';

// authentication
import { useAuth } from "../../contexts/AuthContext";

export default function() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { resetPassword, confirmPasswordReset, verifyPasswordResetCode } = useAuth();
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  let { code } = useParams();

  // check if the code is valid
  useEffect(() => {
    try {
      verifyPasswordResetCode(code);
    } catch (e) {
      setError("invalid code! " + e.message);
    }
  })
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("passwords don't match! please try again.");
    }
    if (!(passwordRef.current.value && passwordConfirmRef.current.value)) {
      return setError("please fill out all fields.");
    }
    try {
      setError(null);
      setLoading(true);
      await confirmPasswordReset(code, passwordRef.current.value);
      history.push("/login");
    } catch (e) {
      setError("there was a problem while trying to perform the requested action. please try again later.");
    }
    setLoading(false);
  }

  return (
    <div className="eve">
      <PageHeader title="Reset Password" />
      <form onSubmit={handleSubmit} className="center-to-screen form-auth" style={{ display: "flex", flexDirection: "column", height: "auto", justifyContent: "center", alignItems: "center", maxWidth: "15vw", minWidth: "300px" }}>
        <h1>{process.env.REACT_APP_APP_TITLE}</h1>
        <h2>/ PASSWORD RESET</h2>
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
          <input ref={passwordRef} type="password" placeholder="password" className="input-box" name="password"></input>
          <input ref={passwordConfirmRef} type="password" placeholder="password (confirm)" className="input-box" name="password-confirm"></input>
          <button type="submit" disabled={loading} className="input-box submit-button button">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span>continue</span>
              <Icon.ArrowForwardIos style={{ paddingLeft: "0.25rem" }} />
            </div>
          </button>
        </div>
        <hr/>
        <div style={{marginBottom: "0.25rem"}}>
          <Link to="/login" className="button-hover-underline flex-align-center"><Icon.ArrowBackIos /> <b>return to login</b></Link>
        </div>
      </form>
    </div>
  );
}
/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

// external imports
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import * as Icon from '@material-ui/icons';

// authentication
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  // loading state
  const [isLoading, setLoading] = useState(true);

  // error state
  const [error, setError] = useState();

  // site configuration
  const [siteConfig, setSiteConfig] = useState({});

  // element references
  const emailRef = useRef();
  const passwordRef = useRef();

  // auth
  const { login, database } = useAuth();

  // history
  const history = useHistory();

  // main submit function
  async function handleSubmit(e) {
    e.preventDefault(); // prevent default form submit behavior
    setError(null); setLoading(true);
    if (!(emailRef.current.value && passwordRef.current.value)) {
      setLoading(false);
      return setError("please fill out all of the required fields.");
    }
    try {
      // refuse to login if disabled by the server
      if (!siteConfig.loginEnabled) {
        setLoading(false);
        return setError("logging in is not enabled at this time. please try again later.");
      } else {
        await login(emailRef.current.value, passwordRef.current.value);
      }
      // if successful, redirect to the home page
      history.push("/");
    } catch (e) {
      // if login failed, display an error message
      switch (e.code) {
        case "auth/wrong-password":
          setError("incorrect password. please try again.");
          break;
        case "auth/user-disabled":
          setError("the account that you're trying to log into has been disabled.");
          break;
        case "auth/user-not-found":
          setError("unable to find a user with that email address.");
          break;
        case "auth/invalid-email":
          setError("invalid email address.");
          break;
        default:
          setError("there was an unknown problem while trying to perform the requested action. please try again later." + e.message);
          break;
      }
    }
    // set loading state to false
    setLoading(false);
  }

  // fetch site configuration
  useEffect(() => {
    database.doc("siteConfig/auth").get().then(async (doc) => {
      const data = doc.data();
      setSiteConfig(data)
    });
    setLoading(false);
  }, []);

  // render
  return (
    <>
      <PageHeader title="Login" />
      <Loader
        className={`loader loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      <form onSubmit={handleSubmit} className="center-to-screen form-auth" style={{ display: "flex", flexDirection: "column", height: "auto", justifyContent: "center", alignItems: "center", minWidth: "16vw", paddingLeft: "24px", paddingRight: "24px" }}>
        <h1>{process.env.REACT_APP_APP_TITLE}</h1>
        <h2>/ LOGIN</h2>
        <br />
        {
          (error &&
          <>
            <alert className="danger">
              <div>
                <h2 style={{ textAlign: "left" }}>ERROR</h2>
                <p style={{ textAlign: "left" }}>{error}</p>
              </div>
            </alert>
          </>)
        }
        <div className="flex flex-column" style={{ width: "auto" }}>
          <input ref={emailRef} type="email" placeholder="email address" className="input-box" name="email"></input>
          <input ref={passwordRef} type="password" placeholder="password" className="input-box" name="password"></input>
          <button type="submit" disabled={isLoading} className="input-box submit-button button">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span>continue</span>
              <Icon.ChevronRight />
            </div>
          </button>
        </div>
        {/* alternate action links */}
        <div id="auth-links">
          <span id="forgot-password-link">
            forgot your password? <Link to="/recover-account" className="button-hover-underline flex-align-center"><strong>recover</strong></Link>
          </span>
          <span id="register-link">
            need an account? <Link to="/signup" className="button-hover-underline flex-align-center"><strong>sign up</strong></Link>
          </span>
        </div>
        <br />
      </form>
    </>
  );
}
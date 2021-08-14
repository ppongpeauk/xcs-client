/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// external imports
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader.js";

export default function (props) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div className="main-content">
      <Loader
        className={`loader loader-page loader-${(!isLoading ? "not-" : "")}visible`}
        visible={true}
      />
      <div className="card" style={{ width: "auto", height: "auto" }}>
        <PageHeader title="Page Not Found" headerTitle="PAGE NOT FOUND" />
        <br />
        <p>you're trying to access a page that does not exist!</p>
        <div>
          <Link to="/" className="button-hover-underline"><b>take me home, country roads</b></Link>
        </div>
      </div>

    </div>
  );
}
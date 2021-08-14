/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect, useState } from "react";

// external imports
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader.js";
import HomeGreeting from "./HomeGreeting";
import HomeStatistics from "./HomeStatistics";

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
      {props.alert}
      <PageHeader title="Home" headerTitle="HOME" description="at a glance" />
      <br />
      <HomeGreeting user={props.user} />
      <br />
      <HomeStatistics user={props.user} />
    </div>
  );
}
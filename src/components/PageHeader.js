/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react";

// external imports
import { Helmet } from "react-helmet";

export default function PageHeader(props) {
  return (
    <div className="page-header">
      {(props.title) && <Helmet><title>{props.title} - {process.env.REACT_APP_APP_SHORT_TITLE}</title></Helmet>}
      <h1>{props.headerTitle} {(props.description) && <small>{props.description}</small>}</h1>
    </div>
  );
}
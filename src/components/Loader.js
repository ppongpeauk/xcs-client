/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react";

// external imports
import Loader from "react-loader-spinner";

export default function(props) {
    return (
      <Loader
        className={props.className}
        style={{paddingBottom: "1rem"}}
        visible={props.visible}
        type="TailSpin"
        color="#000"
        height="8vh"
        width="8vw"
      />
    );
}
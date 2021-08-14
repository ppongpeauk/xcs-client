/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useState, useEffect, useRef, useCallback } from "react";

// external imports
import Cropper from "react-easy-crop";

export default function (props) {

  return (
    <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
      <Cropper
        image={props.image}
        crop={props.crop}
        zoom={props.zoom}
        aspect={1 / 1}
        onCropChange={props.setCrop}
        onZoomChange={props.setZoom}
        cropShape="round"
        disableAutomaticStylesInjection={true}
      />
    </div>
  )
}
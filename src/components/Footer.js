/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return(
    <footer className="main-footer">
      <div className="footer-container">
        <p>Copyright © 2021 EVE. All rights reserved.</p>
        <div className="flex flex-row flex-align-center" style={{fontWeight: 600}}>
          <div style={{paddingLeft: "4px", paddingRight: "4px"}}>
            <Link to="/legal/terms">terms of use</Link>
          </div>
          <div style={{paddingLeft: "4px", paddingRight: "4px"}}>
            <Link to="/legal/privacy">privacy policy</Link>
          </div>
        </div>
        <p>made with ♥️ in washington, d.c.</p>
      </div>
  </footer>
  )
}

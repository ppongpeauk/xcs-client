/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react";

// external imports
import * as Icon from '@material-ui/icons';
import PageHeader from "../../components/PageHeader.js";
import { Link } from "react-router-dom";

function HomeStatistics() {
  return (
    <div className="home-statistics" style={{height: "auto", display: "flex", flexDirection: "row",alignItems: "flex-start", justifyContent: "flex-start"}}>
      <div style={{height: "100%", width: "49%", paddingRight: "2%"}}>
        <PageHeader headerTitle="GLOBAL STATISTICS" description="since the beginning of time" />
        <br/>
        <div className="card fill">
          <div className="card-contents">
              <h3>unable to fetch data</h3>
          </div>
        </div>
      </div>
      <div style={{height: "100%", width: "49%"}}>
        <PageHeader headerTitle="RECENT SCANS" description="only the last 10 scans are shown" />
        <br/>
        <div className="card fill">
          <div className="card-contents">
              <table>
                <tr className="tr-margin">
                  <th>Place Name</th>
                  <th>Entry Point</th>
                  <th>Username</th>
                  <th>Successful</th>
                </tr>

                <tr>
                  <td><Link to="/place/cQ5twfHXGr5P2zhBR9cSiwCU">Office Building</Link></td>
                  <td><Link to="/entry/2gTU7sAd8iHoNJ3r">Main Elevators</Link></td>
                  <td>restrafes</td>
                  <td><Link to="/transaction/9Tyfi6VhcSQLW3y5mf39aL6VKQSVrPjQ2fcirPuKcRcnJouT"><Icon.CheckOutlined style={{color: "#06d6a0"}} /></Link></td>
                </tr>
                <tr>
                  <td><Link to="/place/cQ5twfHXGr5P2zhBR9cSiwCU">Office Building</Link></td>
                  <td><Link to="/entry/2gTU7sAd8iHoNJ3r">Main Entrance</Link></td>
                  <td>767a</td>
                  <td><Link to="/transaction/9Tyfi6VhcSQLW3y5mf39aL6VKQSVrPjQ2fcirPuKcRcnJouT"><Icon.CheckOutlined style={{color: "#06d6a0"}} /></Link></td>
                </tr>
                <tr>
                  <td><Link to="/place/cQ5twfHXGr5P2zhBR9cSiwCU">Office Building</Link></td>
                  <td><Link to="/entry/2gTU7sAd8iHoNJ3r">Service Elevators</Link></td>
                  <td>TheCFrame_Developer</td>
                  <td><Link to="/transaction/9Tyfi6VhcSQLW3y5mf39aL6VKQSVrPjQ2fcirPuKcRcnJouT"><Icon.NotInterestedOutlined style={{color: "#ff686b"}} /></Link></td>
                </tr>
                <tr>
                  <td><Link to="/place/cQ5twfHXGr5P2zhBR9cSiwCU">Office Building</Link></td>
                  <td><Link to="/entry/2gTU7sAd8iHoNJ3r">Rooftop Access</Link></td>
                  <td>cm_an</td>
                  <td>
                    <Link to="/transaction/9Tyfi6VhcSQLW3y5mf39aL6VKQSVrPjQ2fcirPuKcRcnJouT"><Icon.WarningOutlined style={{color: "#ff686b"}} /></Link>
                  </td>
                </tr>
              </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeStatistics;
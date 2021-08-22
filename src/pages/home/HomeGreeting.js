/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react";
// external imports
import { useUser } from "contexts/UserContext";

export default function HomeGreeting(props) {
    const { userProfile } = useUser();

    // time-based greeting
    const now = new Date();
    const hour = now.getHours();
    var timeGreeting = "";
    if (hour < 12) {
        timeGreeting = "morning";
    } else if (hour < 17) {
        timeGreeting = "afternoon";
    } else {
        timeGreeting = "evening";
    }

    return (
        <div className="card" style={{ width: "47%" }}>
            <h2 className="text-lowercase">good {timeGreeting}, {userProfile.profile.name}!</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet risus feugiat in ante metus dictum at tempor commodo. Et malesuada fames ac turpis egestas maecenas.</p>
        </div>
    );
}
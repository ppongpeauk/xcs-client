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

export function UserBadgeTitle(props) {
  return(
    <span className={"profile-badge " + props.className}>
      {props.children}
      {props.title}
    </span>
  )
}

export default function(props) {
  return (
    (!props.user || props.user.elevation == 0) ? <></> :
    props.user.elevation == 1 ? <UserBadgeTitle className={"special-gradient-1"} user={props.user} title={props.title ? "regular user" : false} >{props.icon ? <Icon.LocalActivity className="profile-badge-icon special-gradient-1" /> : <></>}</UserBadgeTitle> :
    props.user.elevation == 2 ? <UserBadgeTitle className={"special-gradient-2"} user={props.user} title={props.title ? "customer service" : false} >{props.icon ? <Icon.Assistant className="profile-badge-icon special-gradient-2" /> : <></>}</UserBadgeTitle> :
    props.user.elevation == 3 ? <UserBadgeTitle className={"special-gradient-3"} user={props.user} title={props.title ? "moderator" : false} >{props.icon ? <Icon.Security className="profile-badge-icon special-gradient-3" /> : <></>}</UserBadgeTitle> :
    props.user.elevation == 4 ? <UserBadgeTitle className={"special-gradient-4"} user={props.user} title={props.title ? props.user.elevationName : false} >{props.icon ? <Icon.AllInclusive className="profile-badge-icon special-gradient-4" /> : <></>}</UserBadgeTitle> :
    props.user.elevation == 5 ? <UserBadgeTitle className={"special-gradient-4"} user={props.user} title={props.title ? props.user.elevationName : false} >{props.icon ? <Icon.Code className="profile-badge-icon special-gradient-4" /> : <></>}</UserBadgeTitle> :
    <></>
  )
}


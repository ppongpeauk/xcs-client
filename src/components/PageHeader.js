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

class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <div className="page-header">
        {(this.props.title) && <Helmet><title>{this.props.title} - {process.env.REACT_APP_APP_SHORT_TITLE}</title></Helmet>}
        <h1>{this.props.headerTitle} {(this.props.description) && <small>{this.props.description}</small>}</h1>
      </div>
    );
  }
}

export default PageHeader;
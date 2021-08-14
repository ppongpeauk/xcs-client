/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React from "react";

// external imports
import PageHeader from "../../components/PageHeader.js";

class Home extends React.Component {
  constructor(props) {
    super(); this.state = { pageLoading: true };
    this.user = props.user;
  }
  render() {
    return <div className="home">
      <PageHeader title="Legal Mumbo Jumbo" headerTitle="Terms of Use" description="" />
      <HomeGreeting user={this.user}/>
      <HomeStatistics/>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  };
}
export default Home;
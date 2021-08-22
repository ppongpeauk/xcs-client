/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";

// external imports
import * as Icon from '@material-ui/icons';
import { CSSTransition as TransitionGroup } from 'react-transition-group';
import UserBadge from "./UserBadge";

// authentication
import { useAuth } from "contexts/AuthContext";
import { useUser } from "contexts/UserContext";

function SideNavbar(props) {
  return (
    <nav className="side-navbar">
      <ul className="side-navbar-nav">
        {props.children}
      </ul>
    </nav>
  );
}
function SideNavbarItem(props) {
  return (
    <li className="side-navbar-item">
      {props.children}
    </li>
  );
}
function SideNavbarLinkText(props) {
  return (
    <span className="side-navbar-link-text">{props.children}</span>
  );
}

function TopNavbar(props) {
  return (
    <nav className="top-navbar">
      <ul className="top-navbar-nav">
        {props.children}
      </ul>
    </nav>
  );
}

function TopNavbarItem(props) {
  return (
    <li className="top-navbar-item">
      {props.children}
    </li>
  );
}
function TopNavbarDropdown(props) {
  const [isLoading] = props.loadingState;
  const [open, setOpen] = props.openState;
  return (
    <TopNavbarItem>
      <Link to={props.to || "#"} className={"top-navbar-link" + (props.profile ? " profile-pane" : "") + (open ? " top-navbar-link-active" : "") + (isLoading ? " top-navbar-link-closed" : "")} onClick={() => setOpen(!open)}>
        {props.children}
      </Link>
      {
        props.dropdown
      }
    </TopNavbarItem>
  );
}

function Dropdown(props) {
  const [isLoading, setLoading] = props.loadingState;
  const [open, setOpen] = props.openState;
  const { logout } = useAuth();
  const history = useHistory();

  const [activeMenu, setActiveMenu] = props.activeMenu;
  //const [menuWidth, setMenuWidth] = useState(null);
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [isLoading])

  function calcDimensions(el) {
    //const width = el.offsetWidth;
    const height = el.offsetHeight;

    //setMenuWidth(width);
    setMenuHeight(height);
  }

  function ProfileDropdownItem(props) {
    return (
      <Link to={props.to || "#"} className="menu-item menu-item-profile" onClick={() => { props.to && setOpen(false) }}>
        <span className="profile-icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </Link>
    );
  }

  function DropdownItem(props) {
    return (
      <Link to={props.to || "#"} className={"menu-item" + (props.returnButton ? " menu-item-return" : "")} onClick={props.isLogoutButton ? handleLogout : () => { props.goToMenu && setActiveMenu(props.goToMenu); props.to && setOpen(false) }}>
        <span className={"icon-button" + (props.returnButton ? " icon-button-return" : "")} returnButton={props.returnButton}>{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </Link>
    );
  }

  async function handleLogout() {
    setLoading(true);
    await logout();
    history.push("/login");
    setLoading(false);
  }

  return (
    <div className={"dropdown" + (!open ? " dropdown-closed" : "")} style={{ height: menuHeight }} ref={dropdownRef}>
      <div className="dropdown-padding">
        <TransitionGroup
          in={activeMenu === 'main'}
          unmountOnExit
          timeout={500}
          classNames="menu-primary"
          onEnter={calcDimensions}
        >
          <div className="menu menu-primary-enter-done">
            {props.user ? <>
              <ProfileDropdownItem to={"/profile/" + ((props.user && props.user.username) || "")} leftIcon={<img alt="user avatar" src={
                props.user && props.user.profile.avatar  /* user profile picture */
              } className="profile-image profile-image-pane"></img>}>
                <p>
                  <h3 style={{ margin: 0, padding: 0 }}>
                    <span style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                      {(props.user && props.user.profile.name) || "unknown user"}
                    </span>
                  </h3>
                  <span>
                    {
                      /* user elevation */
                      //(props.user && props.user.elevation) && (props.user.elevationName || "n/a")

                      /* user creation date */
                      //"member since " + (props.user ? props.user.createdAt.toDate().toLocaleDateString("en-US") : "n/a")

                      /* username */
                      "@" + (props.user ? props.user.username : "n/a")
                    }
                  </span>
                </p>
              </ProfileDropdownItem>
              <UserBadge user={props.user} icon title />
              <DropdownItem leftIcon={<Icon.Settings />} rightIcon={<Icon.NavigateNextRounded />} goToMenu="settings">settings</DropdownItem>
              <DropdownItem leftIcon={<Icon.ExitToApp />} rightIcon={<Icon.NavigateNextRounded />} goToMenu="logout">log out</DropdownItem>
            </> : <>
              <DropdownItem to="/login" leftIcon={<Icon.ExitToApp />}>go to login</DropdownItem>
            </>
            }
          </div>
        </TransitionGroup>
        <TransitionGroup
          in={activeMenu === 'settings'}
          unmountOnExit
          timeout={500}
          classNames="menu-secondary"
          onEnter={calcDimensions}
        >
          <div className="menu menu-secondary-enter-done">
            <DropdownItem leftIcon={<Icon.NavigateBefore />} goToMenu="main" returnButton>SETTINGS</DropdownItem>
            <DropdownItem to="/settings" leftIcon={<Icon.Person />}>manage account</DropdownItem>
          </div>
        </TransitionGroup>
        <TransitionGroup
          in={activeMenu === 'legal'}
          unmountOnExit
          timeout={500}
          classNames="menu-secondary"
          onEnter={calcDimensions}
        >
          <div className="menu menu-secondary-enter-done">
            <DropdownItem leftIcon={<Icon.NavigateBefore />} goToMenu="main" returnButton>LEGAL</DropdownItem>
            <DropdownItem to="/terms-of-use" leftIcon={<Icon.AssignmentLate />}>terms of use</DropdownItem>
            <DropdownItem to="/privacy-policy" leftIcon={<Icon.AssignmentInd />}>privacy policy</DropdownItem>
          </div>
        </TransitionGroup>
        <TransitionGroup
          in={activeMenu === 'logout'}
          unmountOnExit
          timeout={500}
          classNames="menu-secondary"
          onEnter={calcDimensions}
        >
          <div className="menu menu-secondary-enter-done">
            <DropdownItem leftIcon={<Icon.NavigateBefore />} goToMenu="main" returnButton>LOGOUT</DropdownItem>
            <DropdownItem leftIcon={<Icon.DoneAll />} isLogoutButton>are you sure?</DropdownItem>
          </div>
        </TransitionGroup>
      </div>
    </div>
  );
}
export default function Navbar(props) {
  const [isLoading, setLoading] = useState(true);

  const { userCredential } = useAuth();
  const { userProfile } = useUser();

  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  useEffect(() => { // return to the main section on the main dropdown once something is clicked
    setTimeout(() => {
      setActiveMenu("main");
    }, 0.1);
  }, [open]);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div className="main-navbar">
      <TopNavbar>
        <TopNavbarItem>
          <Link exact to="/">
            <div className="top-navbar-logo-text">
              <p>EVE : XCS</p>
            </div>
          </Link>
        </TopNavbarItem>
        {
          !isLoading && (
            <TopNavbarDropdown openState={[open, setOpen]} dropdown={<Dropdown activeMenu={[activeMenu, setActiveMenu]} user={userProfile} loadingState={props.loadingState} openState={[open, setOpen]} />} loadingState={props.loadingState} profile>
              {/*props.user && <img alt="user avatar" src={props.user ? props.user.profile.avatar : defaultProfileImage} className="profile-image profile-image-pane"></img>*/}
              <p className="profile-bar-name">
                {userProfile ? userProfile.profile.name : "login"}
              </p>
              <Icon.ArrowDropDown />
            </TopNavbarDropdown>
          )
        }
      </TopNavbar>

      <SideNavbar>
        {
          userCredential ? <>
            <SideNavbarItem>
              <NavLink exact to="/" activeClassName="navbar-link-active" className="side-navbar-link">
                <Icon.Home />
                <SideNavbarLinkText>home</SideNavbarLinkText>
              </NavLink>
            </SideNavbarItem>
            <SideNavbarItem>
              <NavLink exact to="/locations" activeClassName="navbar-link-active" className="side-navbar-link">
                <Icon.Place />
                <SideNavbarLinkText>manage locations</SideNavbarLinkText>
              </NavLink>
            </SideNavbarItem>
            <SideNavbarItem>
              <NavLink exact to="/organizations" activeClassName="navbar-link-active" className="side-navbar-link">
                <Icon.Group />
                <SideNavbarLinkText>organizations</SideNavbarLinkText>
              </NavLink>
            </SideNavbarItem>
          </> : <>
            <SideNavbarItem>
              <NavLink to="/login" activeClassName="navbar-link-active" className="side-navbar-link">
                <Icon.ExitToApp />
                <SideNavbarLinkText>go to login</SideNavbarLinkText>
              </NavLink>
            </SideNavbarItem>
          </>
        }
        <hr className="side-navbar-section-divider"></hr>
        <SideNavbarItem>
          <a href="https://discord.gg/a2ZsmPB" target="_blank" rel="noreferrer" className="side-navbar-link">
            <svg viewBox="0 0 71 55" aria-hidden="true">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2" />
            </svg>
            <SideNavbarLinkText>discord server</SideNavbarLinkText>
          </a>
        </SideNavbarItem>
      </SideNavbar>
    </div>
  );
}
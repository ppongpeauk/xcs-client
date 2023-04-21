"use client";

import { useAuthContext } from "@/context/user";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import styles from "./Navbar.module.css";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import HouseRoundedIcon from "@mui/icons-material/HouseRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Url } from "next/dist/shared/lib/router/router";
import {
  HTMLAttributeAnchorTarget,
  MouseEventHandler,
  ReactElement
} from "react";

interface NavbarButtonParameters {
  title: String;
  url: Url;
  icon: ReactElement;
  target?: HTMLAttributeAnchorTarget;
  onClick: MouseEventHandler;
  premium?: boolean;
}

function NavbarButton({
  title,
  url,
  icon,
  target,
  onClick,
  premium
}: NavbarButtonParameters) {
  const currentRoute = usePathname() as any;
  return (
    <Link
      className={`${styles.navButton} ${
        (!premium && currentRoute == url) ? styles.navButton__active : ""
      } ${premium ? styles.navButton__premium : ""}`}
      href={url}
      onClick={onClick}
      target={target || ""}
    >
      <>
        {icon}
        {title}
      </>
    </Link>
  );
}

export default function Navbar(props: {
  setVisible: (visible: boolean) => void;
  visible: boolean;
}) {
  const router = useRouter();
  const currentRoute = usePathname();

  const { user } = useAuthContext();

  function setNavbarVisible(visible: boolean) {
    if (window.innerWidth < 768) {
      props.setVisible(visible);
    }
  }

  return (
    <div
      className={`${styles.nav} ${!props.visible ? styles.navInvisible : ""}`}
    >
      <div className={styles.navTitle}>
        <Link href="/platform/home">EVE XCS</Link>
      </div>
      <div className={`${styles.navButtons} mb-auto`}>
        <span className={styles.navCategoryTitle}>Main Menu</span>
        <NavbarButton
          title="Home"
          onClick={() => setNavbarVisible(false)}
          url="/platform/home"
          icon={
            <HouseRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          }
        />
        <NavbarButton
          title="Event Logs"
          onClick={() => setNavbarVisible(false)}
          url="/platform/event-logs"
          icon={
            <SensorsRoundedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
          }
        />
        <NavbarButton
          title="Profile"
          onClick={() => setNavbarVisible(false)}
          url="/platform/profile"
          icon={
            <BadgeRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          }
        />
        <NavbarButton
          title="Organizations"
          onClick={() => setNavbarVisible(false)}
          url="/platform/organizations"
          icon={
            <CorporateFareRoundedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
          }
        />
        <NavbarButton
          title="Locations"
          onClick={() => setNavbarVisible(false)}
          url="/platform/locations"
          icon={
            <WidgetsRoundedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
          }
        />
        <NavbarButton
          title="Get Support"
          onClick={() => setNavbarVisible(false)}
          url="https://discord.gg/a2ZsmPB"
          icon={
            <SupportRoundedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
          }
          target="_blank"
        />
        {user?.isPremium === false ? (
          <>
            <span className={styles.navCategoryTitle}>Membership</span>
            <NavbarButton
              title="Upgrade"
              onClick={() => setNavbarVisible(false)}
              url="/platform/upgrade"
              icon={
                <WorkspacePremiumIcon
                sx={{ fontSize: "24px", marginRight: "12px" }}
              />
              }
              premium={true}
            />
          </>
        ) : null}
      </div>
      <div className={`${styles.navButtons} mb-4`}>
        <span className={styles.navCategoryTitle}>
          Version {process.env.NEXT_PUBLIC_VERSION}
        </span>
      </div>
    </div>
  );
}

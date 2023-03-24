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

export default function Navbar(props: {
  setVisible: (visible: boolean) => void;
  visible: boolean;
}) {
  const router = useRouter();
  const currentRoute = usePathname();

  const { user } = useAuthContext();

  function setNavbarVisible(visible: boolean) {
    console.log(window.innerWidth);
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
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/home" ? styles.navButton__active : ""
          }`}
          onClick={() => setNavbarVisible(false)}
          href="/platform/home"
        >
          <HouseRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Home
        </Link>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/event-logs"
              ? styles.navButton__active
              : ""
          }`}
          href="/platform/event-logs"
          onClick={() => setNavbarVisible(false)}
        >
          <SensorsRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Event Logs
        </Link>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/profile" ? styles.navButton__active : ""
          }`}
          href="/platform/profile"
          onClick={() => setNavbarVisible(false)}
        >
          <BadgeRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Profile
        </Link>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/organizations"
              ? styles.navButton__active
              : ""
          }`}
          href="/platform/organizations"
          onClick={() => setNavbarVisible(false)}
        >
          <CorporateFareRoundedIcon
            sx={{ fontSize: "24px", marginRight: "12px" }}
          />
          Organizations
        </Link>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/locations"
              ? styles.navButton__active
              : ""
          }`}
          href="/platform/locations"
          onClick={() => setNavbarVisible(false)}
        >
          <WidgetsRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Locations
        </Link>
        <Link
          className={styles.navButton}
          href="https://discord.gg/a2ZsmPB"
          target="_blank"
        >
          <SupportRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Get Support
        </Link>
        {user?.isPremium === false ? (
          <>
            <span className={styles.navCategoryTitle}>Upgrade</span>
            <Link
              className={`${styles.navButton} ${styles.navButton__premium}`}
              href="/platform/upgrade"
            >
              <WorkspacePremiumIcon
                sx={{ fontSize: "24px", marginRight: "12px" }}
              />
              Upgrade
            </Link>
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

import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "@firebase/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import Link from "next/link";
import styles from "./Navbar.module.css";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CorporateFareRoundedIcon from "@mui/icons-material/CorporateFareRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import HouseRoundedIcon from "@mui/icons-material/HouseRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";

export default function Navbar() {
  const router = useRouter();
  const currentRoute = router.pathname;
  const app = initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <></>;
  }

  return (
    <div className={styles.nav}>
      <div className={styles.navTitle}>
        <Link href="/">EVE XCS</Link>
      </div>
      <div className={`${styles.navButtons} mb-auto`}>
        <span className={styles.navCategoryTitle}>Main Menu</span>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/home" ? styles.navButton__active : ""
          }`}
          href="/platform/home"
        >
          <HouseRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Home
        </Link>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/activity" ? styles.navButton__active : ""
          }`}
          href="/platform/activity"
        >
          <SensorsRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Recent Activity
        </Link>
        <Link
          className={`${styles.navButton} ${
            currentRoute == "/platform/profile" ? styles.navButton__active : ""
          }`}
          href="/platform/profile"
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
        >
          <WidgetsRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Locations
        </Link>
        <Link
          className={styles.navButton}
          href="https://discord.gg/a2ZsmPB"
          target="_blank"
        >
          <ForumRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Support Server
        </Link>
      </div>
      <div className={`${styles.navButtons} mb-4`}>
        <span className={styles.navCategoryTitle}>V0.8 beta</span>
      </div>
    </div>
  );
}

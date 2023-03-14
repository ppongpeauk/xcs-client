import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "@firebase/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

import Link from "next/link";
import styles from "./Navbar.module.css";

import HouseRoundedIcon from "@mui/icons-material/HouseRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";

export default function Navbar() {
  const router = useRouter();
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
      <div className={styles.navButtons}>
        <span className={styles.navCategoryTitle}>Main Menu</span>
        <Link className={styles.navButton} href="/xcs/home">
          <HouseRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Home
        </Link>
        <Link className={styles.navButton} href="/xcs/locations">
          <WidgetsRoundedIcon sx={{ fontSize: "24px", marginRight: "12px" }} />
          Locations
        </Link>
      </div>
    </div>
  );
}

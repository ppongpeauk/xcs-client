import Navbar from "@/components/Navbar";
import styles from "@/pages/platform/main.module.css";

import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Head from "next/head";
import Link from "next/link";

import { useState } from "react";

import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "@firebase/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

// <MarkEmailUnreadRoundedIcon/>

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const router = useRouter();
  const app = initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [accountDropdownVisible, setAccountDropdownVisible] = useState(false);

  const pageNames = {
    "/platform/home": "Home",
    "/platform/activity": "Recent Activity",
    "/platform/profile": "Profile",
    "/platform/locations": "Locations",
    "/platform/organizations": "Organizations",
  };

  return (
    <>
      <Head>
        <title>EVE XCS</title>
      </Head>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>{pageNames[router.pathname]}</h1>
          <div className={styles.topBarButtons}>
            <button className={styles.topBarButton}>
              <MarkunreadOutlinedIcon sx={{ fontSize: "24px" }} />
            </button>
            <button
              className={`${styles.topBarButton} ${styles.topBarAccountButton}`}
              onClick={() => setAccountDropdownVisible(!accountDropdownVisible)}
            >
              <img
                src="https://cdn.discordapp.com/attachments/813308393208414219/1085048432823128114/0ec4c87ead4f513c336f092a803a8cf6.png"
                alt="Avatar"
                className={styles.topBarAvatar}
              />
            </button>
          </div>
        </div>
        {accountDropdownVisible && (
          <>
            <div
              className={styles.accountDropdownModal}
              onClick={() => setAccountDropdownVisible(false)}
            ></div>
          </>
        )}
        <div
          className={`${styles.accountDropdownContainer} ${
            !accountDropdownVisible
              ? styles.accountDropdownContainer__invisible
              : null
          }`}
        >
          <Link href="/xcs/profile" className={styles.accountDropdownHeader}>
            <img
              src="https://cdn.discordapp.com/attachments/813308393208414219/1085048432823128114/0ec4c87ead4f513c336f092a803a8cf6.png"
              alt="Avatar"
              className={styles.accountDropdownAvatar}
            />
            <div className={styles.accountDropdownHeaderInfo}>
              <h1 className={styles.accountDropdownHeaderName}>Eve Holloway</h1>
              <h1 className={styles.accountDropdownHeaderRole}>
                Premium Member
              </h1>
              <h1 className={styles.accountDropdownHeaderEmail}>
                eholl2004@gmail.com
              </h1>
            </div>
          </Link>
          <Link href="/xcs/settings" className={styles.accountDropdownButton}>
            <SettingsOutlinedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
            Settings
          </Link>
          <button
            className={styles.accountDropdownButton}
            onClick={() => {
              auth.signOut();
            }}
          >
            <ExitToAppOutlinedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
            Logout
          </button>
        </div>
        {children}
      </main>
    </>
  );
}

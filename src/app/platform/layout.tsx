"use client";

import styles from "@/app/platform/main.module.css";
import Navbar from "../../components/Navbar";

import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Link from "next/link";

import { useEffect, useState } from "react";

import { getAuth } from "@firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../../firebase/firebaseApp";

export default function AppLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const app = initFirebase();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [accountDropdownVisible, setAccountDropdownVisible] = useState(false);

  const pageNames: { [key: string]: any } = {
    "/platform/home": "Home",
    "/platform/activity": "Recent Activity",
    "/platform/profile": "Profile",
    "/platform/locations": "Locations",
    "/platform/organizations": "Organizations",
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/idp/login");
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>{pageNames[pathname]}</h1>
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

"use client";

import styles from "@/app/platform/main.module.css";
import Navbar from "../../components/Navbar";

import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Image from "next/image";
import Link from "next/link";

import "react-loading-skeleton/dist/skeleton.css";

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
  const [navbarVisible, setNavbarVisible] = useState(true);

  const pageNames: { [key: string]: any } = {
    "/platform/home": "Home",
    "/platform/event-logs": "Event Logs",
    "/platform/profile": "Profile",
    "/platform/locations": "Locations",
    "/platform/organizations": "Organizations",
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/idp/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setNavbarVisible(false);
    }
  }, []);

  return !loading && user ? (
    <>
      <main
        className={`${styles.main} ${
          navbarVisible ? styles.navbarVisible : ""
        }`}
      >
        <Navbar setVisible={setNavbarVisible} visible={navbarVisible} />
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>{pageNames[pathname]}</h1>
          <div className={styles.topBarButtons}>
            <button
              className={styles.topBarButton}
              onClick={() => {
                setNavbarVisible(!navbarVisible);
                setAccountDropdownVisible(false);
              }}
            >
              <MenuOpenRoundedIcon sx={{ fontSize: "32px" }} />
            </button>
            <button
              className={`${styles.topBarButton} ${styles.topBarAccountButton}`}
              onClick={() => setAccountDropdownVisible(!accountDropdownVisible)}
            >
              <Image
                src="https://cdn.discordapp.com/attachments/813308393208414219/1085935705986977812/1194f174e0d1281d41157074e5072436.png"
                alt="Avatar"
                width={64}
                height={64}
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
          <Link
            href="/xcs/profile"
            className={styles.accountDropdownHeader}
            onClick={() => {
              setAccountDropdownVisible(false);
            }}
          >
            <Image
              src="https://cdn.discordapp.com/attachments/813308393208414219/1085048432823128114/0ec4c87ead4f513c336f092a803a8cf6.png"
              width={64}
              height={64}
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
              setAccountDropdownVisible(false);
            }}
          >
            <ExitToAppOutlinedIcon
              sx={{ fontSize: "24px", marginRight: "12px" }}
            />
            Logout
          </button>
        </div>
        <div className={styles.mainContent}>{children}</div>
      </main>
    </>
  ) : null;
}

"use client";

import styles from "@/app/platform/main.module.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Image from "next/image";
import Link from "next/link";

import "react-loading-skeleton/dist/skeleton.css";

import { useEffect, useState } from "react";

import { auth } from "@/firebase/firebaseApp";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../../firebase/firebaseApp";

import { useAuthContext } from "@/context/user";

export default function AppLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const app = initFirebase();
  const [firebaseUser, loading] = useAuthState(auth);
  const { user } = useAuthContext();
  const [accountDropdownVisible, setAccountDropdownVisible] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);

  const pageNames: { [key: string]: any } = {
    "/platform/home": "Home",
    "/platform/event-logs": "Event Logs",
    "/platform/profile": "Profile",
    "/platform/locations": "Locations",
    "/platform/organizations": "Organizations",
    "/platform/upgrade": "Upgrade",
  };

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.push("/idp/login");
    }
  }, [loading, router, firebaseUser]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setNavbarVisible(false);
    }
  }, []);

  return !loading && firebaseUser && user ? (
    <>
      <main
        className={`${styles.main} ${
          navbarVisible ? styles.navbarVisible : ""
        }`}
      >
        <Navbar setVisible={setNavbarVisible} visible={navbarVisible} />
        <div className={styles.topBar}>
          <button
            className={`${styles.topBarButton} ${styles.topBarMenuButton}`}
            onClick={() => {
              setNavbarVisible(!navbarVisible);
              setAccountDropdownVisible(false);
            }}
          >
            <MenuOpenRoundedIcon sx={{ fontSize: "32px" }} />
          </button>
          <h1 className={styles.pageTitle}>{pageNames[pathname as string]}</h1>
          <div className={styles.topBarButtons}>
            <button
              className={`${styles.topBarButton} ${styles.topBarAccountButton}`}
              onClick={() => setAccountDropdownVisible(!accountDropdownVisible)}
            >
              <Image
                src={user.data?.avatarURI}
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
            href="/platform/profile"
            className={styles.accountDropdownHeader}
            onClick={() => {
              setAccountDropdownVisible(false);
            }}
          >
            <Image
              src={user.data?.avatarURI}
              width={64}
              height={64}
              alt="Avatar"
              className={styles.accountDropdownAvatar}
            />
            <div className={styles.accountDropdownHeaderInfo}>
              <h1
                className={styles.accountDropdownHeaderName}
              >{`${user.data?.name.first} ${user.data?.name.last}`}</h1>
              <h1 className={styles.accountDropdownHeaderSubname}>
                {`@${user.data?.username}`}
              </h1>
              {user.data?.platform.membership === "premium" ? (
                <>
                  <h1 className={styles.accountDropdownHeaderRole}>
                    <WorkspacePremiumIcon
                      className={styles.accountDropdownHeaderRoleIcon}
                      sx={{
                        height: "100%",
                      }}
                    />
                    XCS Premium
                  </h1>
                </>
              ) : (
                <>
                  <h1 className={styles.accountDropdownHeaderRole}>
                    Free User
                  </h1>
                </>
              )}
              <h1 className={styles.accountDropdownHeaderEmail}>
                {user.email}
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
        <div className={styles.mainContent}>
          {children}
          {/* <Footer /> */}
        </div>
      </main>
    </>
  ) : (
    <>
      <h1>
        Loading...
      </h1>
    </>
  );
}

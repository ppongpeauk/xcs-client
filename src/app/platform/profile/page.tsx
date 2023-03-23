"use client";

import styles from "./profile.module.css";

import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "@firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

import { useEffect, useState } from "react";

import Image from "next/image";
import Skeleton from "react-loading-skeleton";

import { useAuthContext } from "@/context/user";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const app = initFirebase();
  const auth = getAuth();
  const [firebaseUser, loading] = useAuthState(auth);
  const { user }: any = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, Math.floor(Math.random() * 1500));
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.badgeContainer}>
          <div className={styles.badgeSlotPunch} />
          <div className={styles.badgeInfo}>
            {isLoading ? (
              <Skeleton
                className={styles.badgeImage}
                height={200}
                width={200}
                duration={1}
              />
            ) : (
              <Image
                className={styles.badgeImage}
                src={user.avatar}
                alt="User Badge Image"
                width={512}
                height={512}
              />
            )}
          </div>
          <h1 className={styles.badgeInfoName}>
            {isLoading ? (
              <Skeleton
                className={styles.badgeInfoName}
                width={200}
                height={24}
                duration={1}
              />
            ) : (
              user.name
            )}
          </h1>
          <h2 className={styles.badgeInfoTitle}>
            {isLoading ? (
              <Skeleton
                className={styles.badgeInfoTitle}
                width={200}
                height={24}
                duration={1}
              />
            ) : (
              user.role
            )}
          </h2>
          {isLoading ? null : (
            <Image
              className={styles.badgeBarcode}
              src={`https://barcodeapi.org/api/pdf417/{id:'${user.id}'}`}
              alt="User Barcode"
              width={256}
              height={256}
            ></Image>
          )}
        </div>
        <div className={styles.info}>
          {isLoading ? (
            <Skeleton
              className={styles.badgeInfoTitle}
              width={1024}
              height={24}
              duration={1}
              style={{ marginBottom: "1rem" }}
              count={16.5}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

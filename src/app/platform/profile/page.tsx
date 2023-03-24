"use client";

import styles from "./profile.module.css";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import Image from "next/image";
import Skeleton from "react-loading-skeleton";

import { useAuthContext } from "@/context/user";

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Page() {
  const router = useRouter();
  const { user }: any = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  
  const createCustomerPortalSession = async () => {
    const portalSession = await axios.post("/api/create-customer-portal-session", {
      user: user,
    });
    router.push(portalSession.data.url);
  };

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
          ) : (
            <>
              <h2 className={styles.infoTitle}>Personal Information</h2>
              <button onClick={createCustomerPortalSession}>Manage billing</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

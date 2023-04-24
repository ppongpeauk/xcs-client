"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Head from "next/head";
import styles from "./invitation.module.css";

export default function Invitation() {
  const router = useSearchParams();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Head>
        <title>EVE XCS - Invitation</title>
        <meta property="og:title" content="EVE XCS" />
        <meta name="description" content="Authenticate" key="desc" />
        <meta
          property="og:description"
          content="And a social description for our cool page"
        />
        <meta
          property="og:image"
          content="https://example.com/images/cool-page.jpg"
        />
      </Head>
      <main className={styles.main}>
        <div className={styles.cornerLogo}>
          <Link href="/">EVE XCS</Link>
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>Invitation</h1>
        </div>
        <div className={styles.invitationGraphic}>
          
        </div>

        <div className={styles.background}></div>
      </main>
    </>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../upgrade.module.css";
import successGif from "./success.gif";

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    setTimeout(() => {
      router.push("/platform");
    }, 2000);
  }, [router]);

  return <>
    <div className={styles.main}>
      <Image src={successGif} width={512} height={512} alt="success" />
    </div>
  </>
}
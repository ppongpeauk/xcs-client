"use client";

import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/idp");
  }, []);

  return (
    <>
      <main className={styles.main}></main>
    </>
  );
}

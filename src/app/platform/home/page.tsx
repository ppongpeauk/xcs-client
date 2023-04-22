"use client";

import { auth } from "@/firebase/firebaseApp";
import { useRouter } from "next/navigation";
import { initFirebase } from "../../../firebase/firebaseApp";

import styles from "./home.module.css";

import { useAuthContext } from "@/context/user";

import Link from "next/link";

export default function Page() {
  const app = initFirebase();
  const router = useRouter();
  const { user } = useAuthContext();

  return (
    <>
      <div className={styles.main}>
        <h1>There&apos;s nothing here yet...</h1>
        <Link
          className={`${styles.formButton} w-4`}
          href="/platform/event-logs"
        >
          Go to Event Logs
        </Link>
      </div>
    </>
  );
}

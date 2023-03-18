"use client";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../../../firebase/firebaseApp";

import Image from "next/image";
import styles from "./home.module.css";

export default function Page() {
  const app = initFirebase();
  const router = useRouter();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <div className={styles.main}>
        <Image
          src="https://media.discordapp.net/attachments/564222011602370565/775109721631227934/ele.gif"
          alt="EVE XCS"
          width={100}
          height={100}
        ></Image>
      </div>
    </>
  );
}

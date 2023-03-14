import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useAuthState,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";

import Head from "next/head";
import styles from "../auth.module.css";

export default function Login() {
  const router = useRouter();
  const app = initFirebase();
  const auth = getAuth();
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const [user, loading] = useAuthState(auth);
  const [alert, setAlert] = useState("");
  const [pending, setPending] = useState(false);

  const [usernameField, setUsernameField] = useState("");

  // redirect to /idp/login if the user is not logged in
  useEffect(() => {
    if (loading) return;
    if (user) {
      router.push("/xcs/home");
    }
  }, [loading, user]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (sending || pending) return;

    // reset page states
    setPending(true);
    setAlert("");

    // attempt to sign in
    setTimeout(() => {
      sendPasswordResetEmail(usernameField)
        .then((res) => {
          if (res) {
            router.push("/");
          } else {
            setAlert(
              "Unable to send a password reset email. Please check your username and try again."
            );
          }
        })
        .finally(() => setPending(false));
    }, 500);
  };

  useEffect(() => {
    setAlert("");
  }, [usernameField]);

  return (
    <>
      <Head>
        <title>EVE XCS - Authenticate</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.cornerLogo}>
          <Link href="/">EVE XCS</Link>
        </div>
        <div className={styles.form}>
          <div className={styles.formContainer}>
            {/* Hero title */}
            <div className={styles.welcomeGreeting}>
              <h1 className={styles.welcomeTitle}>Reset Password</h1>
            </div>
            {/* Alert */}
            {alert && (
              <div className={styles.alertContainer}>
                <div className={styles.alertMessage}>{alert}</div>
              </div>
            )}
            <form onSubmit={onSubmit}>
              <label htmlFor="username">Username</label>
              <input
                className={styles.formInput}
                type="username"
                id="username"
                name="username"
                onChange={(e) => setUsernameField(e.target.value)}
              />
              <button
                className={`${styles.formButton} ${styles.formButtonPrimary}`}
                type="submit"
                disabled={pending}
              >
                Request Password Reset Link
              </button>
              <div />
              <Link className={styles.forgotPasswordLink} href="/idp/login">
                Return to Login
              </Link>
            </form>
          </div>
        </div>
        <div className={styles.background}></div>
      </main>
    </>
  );
}

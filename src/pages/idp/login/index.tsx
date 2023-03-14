import { initFirebase } from "@/firebase/firebaseApp";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";

import Head from "next/head";
import styles from "../auth.module.css";

export default function Login() {
  const router = useRouter();
  const app = initFirebase();
  const auth = getAuth();
  const [signInWithEmailAndPassword, userSO, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [user] = useAuthState(auth);
  const [alert, setAlert] = useState("");
  const [pending, setPending] = useState(false);

  const [usernameField, setUsernameField] = useState("");
  const [passwordField, setPasswordField] = useState("");

  // redirect to /idp/login if the user is not logged in
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/idp/login");
    } else {
      router.push("/xcs/home");
    }
  }, [loading, user]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pending) return;
    if (!usernameField || !passwordField) {
      setAlert("Please enter your username and password.");
      return;
    }

    // reset page states
    setPending(true);
    setAlert("");

    // attempt to sign in
    setTimeout(() => {
      signInWithEmailAndPassword(usernameField, passwordField)
        .then((res) => {
          if (res) {
            router.push("/");
          } else {
            setAlert(
              "Are you sure you've entered the right login or password? Please check and try again."
            );
          }
        })
        .finally(() => setPending(false));
    }, 500);
  };

  useEffect(() => {
    setAlert("");
  }, [usernameField, passwordField]);

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
              <h1 className={styles.welcomeTitle}>Log in to XCS</h1>
              <span className={styles.welcomeSubtitle}>
                Please present your credentials.
              </span>
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
              <label htmlFor="password">Password</label>
              <input
                className={styles.formInput}
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPasswordField(e.target.value)}
              />
              <button
                className={`${styles.formButton} ${styles.formButtonPrimary}`}
                type="submit"
                disabled={pending}
              >
                Sign in
              </button>
              <div />
              <Link className={styles.forgotPasswordLink} href="/idp/reset">
                Forgot your password?
              </Link>
            </form>
            <div className={styles.authOptionLinks}>
              <span>
                Need help?{" "}
                <Link className={styles.authOptionLink} href="/auth/faq">
                  View FAQ.
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.background}></div>
      </main>
    </>
  );
}

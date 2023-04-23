"use client";

import { auth } from "@/firebase/firebaseApp";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    useAuthState,
    useSignInWithEmailAndPassword
} from "react-firebase-hooks/auth";
import { initFirebase } from "../../../firebase/firebaseApp";

import Head from "next/head";
import styles from "../auth.module.css";

import CloseIcon from "@mui/icons-material/Close";

export default function Login() {
  const router = useRouter();
  const app = initFirebase();
  const [signInWithEmailAndPassword, userSO, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [user] = useAuthState(auth);

  const [alert, setAlert] = useState("");
  const [pending, setPending] = useState(false);

  const [usernameField, setUsernameField] = useState("");
  const [passwordField, setPasswordField] = useState("");

  const [faqVisible, setFaqVisible] = useState(false);

  // redirect to /idp/login if the user is not logged in
  useEffect(() => {
    if (user) {
      router.push("/platform/home");
    }
  }, [router, user]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pending) return;

    // reset page states
    setPending(true);
    setAlert("");

    // if (!usernameField || !passwordField) {
    //   setAlert("Please fill in all of the fields.");
    //   setPending(false);
    //   return;
    // }

    // attempt to sign in
    setTimeout(async () => {
      let email = "";
      await axios
        .post("/api/v1/email-by-username", null, {
          params: { username: usernameField || "" },
        })
        .then((res) => {
          if (res.data.email) {
            console.log(res.data.email);
            email = res.data.email;
          } else {
            setAlert(
              "Are you sure you've entered the right login or password? Please check and try again."
            );
            setPending(false);
            return;
          }
        });

      signInWithEmailAndPassword(email, passwordField)
        .then((res) => {
          if (res) {
            router.push("/");
          } else {
            // handle error codes
            switch (error?.code) {
              case "auth/too-many-requests":
                setAlert("Too many login attempts. Please try again later.");
                break;
              case "auth/network-request-failed":
                setAlert(
                  "Unable to connect to the server. Please check your internet connection and try again."
                );
                break;
              default:
                setAlert(
                  "Are you sure you've entered the right login or password? Please check and try again."
                );
                break;
            }
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
        <div
          className={`${styles.faqModal} ${
            !faqVisible ? styles.faqModal__invisible : ""
          }`}
          onClick={() => {
            setFaqVisible(false);
          }}
        >
          <div className={`${styles.faqContainer}`}>
            <div className={`${styles.faqContent}`}>
              <div className={`${styles.faqHeader}`}>
                <h1 className={`${styles.faqTitle}`}>
                  Frequently Asked Questions
                  <button
                    className={`${styles.faqClose}`}
                    onClick={() => {
                      setFaqVisible(false);
                    }}
                  >
                    <CloseIcon
                      sx={{
                        height: "100%",
                        fontSize: "24px",
                      }}
                    />
                  </button>
                </h1>
              </div>
              <div className={`${styles.faqBody}`}>
                <div className={`${styles.faqItem}`}>
                  <h2 className={`${styles.faqItemTitle}`}>What is EVE XCS?</h2>
                  <p className={`${styles.faqItemBody}`}>
                    EVE XCS is an online access point control platform developed
                    by Restrafes & Co. that allows organizations to manage and
                    control access to their facilities remotely.
                  </p>
                </div>
                <div className={`${styles.faqItem}`}>
                  <h2 className={`${styles.faqItemTitle}`}>
                    What is my login?
                  </h2>
                  <p className={`${styles.faqItemBody}`}>
                    Your login for EVE XCS is the email address that was used to
                    invite you to the platform. If you are unsure of your login
                    or did not receive an invitation, please contact the
                    authorized member of your organization who manages access
                    control or email xcs@restrafes.co for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <button
                  className={styles.authOptionLink}
                  onClick={() => {
                    setFaqVisible(true);
                  }}
                >
                  View the FAQ.
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.background}></div>
      </main>
    </>
  );
}

"use client";

import { getAuth } from "firebase/auth";
import { initFirebase } from "../../../firebase/firebaseApp";

import styles from "./upgrade.module.css";

import { useAuthContext } from "@/context/user";

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Page() {
  const app = initFirebase();
  const auth = getAuth();
  const { user } = useAuthContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createCheckoutSession = async () => {
    const stripe = (await stripePromise) as any;
    const checkoutSession = await axios.post("/api/create-stripe-session", {
      item: "eve-xcs",
      user: user,
    });
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result.error) {
      alert(result.error.message);
    }
  };

  useEffect(() => {
    if (!searchParams) return;
    if (searchParams.get("success")) {
      router.push("/platform/upgrade/thank-you");
    }
  }, [router, searchParams]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.subscriptionPlan}>
          <div className={styles.subscriptionPlanHeader}>
            <h1 className={styles.subscriptionPlanTitle}>Free Plan</h1>
            <p>The perfect plan for starters</p>
            <h1 className={styles.subscriptionPlanPrice}>
              $0{" "}
              <span className={styles.subscriptionPlanRecurrence}>/month</span>
            </h1>
          </div>
          <div className={styles.subscriptionPlanDivider} />
          <ul className={styles.subscriptionPlanFeatures}>
            <h2 className={styles.subscriptionPlanCategory}>Locations</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                2 Locations
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>Entry Points</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                4 Access Points per Location
              </span>
            </li>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Access assignable to only users
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>Organizations</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                1 Organization
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>Event Logs</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>-</span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>
              Customer Support
            </h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Limited Support
              </span>
            </li>
          </ul>
          {!user.isPremium ? (
            <div className={styles.subscriptionPlanInteract}>
              <p>Current Plan</p>
            </div>
          ) : null}
        </div>
        <div
          className={`${styles.subscriptionPlan} ${styles.subscriptionPlanPremium}`}
        >
          <div className={styles.subscriptionPlanHeader}>
            <h1 className={styles.subscriptionPlanTitle}>XCS Premium</h1>
            <p>For users who want to do more</p>
            <h1 className={styles.subscriptionPlanPrice}>
              $2.49{" "}
              <span className={styles.subscriptionPlanRecurrence}>/month</span>
            </h1>
          </div>
          <div className={styles.subscriptionPlanDivider} />
          <ul className={styles.subscriptionPlanFeatures}>
            <h2 className={styles.subscriptionPlanCategory}>Locations</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Unlimited Locations
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>Entry Points</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Unlimited Access Points per Location
              </span>
            </li>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Access assignable to users and groups
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>Organizations</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                16 Organizations
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>Event Logs</h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Access to Event Logs (up to 30 days old)
              </span>
            </li>
            <h2 className={styles.subscriptionPlanCategory}>
              Customer Support
            </h2>
            <li className={styles.subscriptionPlanFeature}>
              <span className={styles.subscriptionPlanFeatureText}>
                Priority Support
              </span>
            </li>
          </ul>
          {user.isPremium ? (
            <div className={styles.subscriptionPlanInteract}>
              <p>Current Plan</p>
            </div>
          ) : (
            <div className={styles.subscriptionPlanInteract}>
              <button
                className={styles.formButton}
                onClick={createCheckoutSession}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

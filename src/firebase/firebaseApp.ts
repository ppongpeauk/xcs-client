// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoNw4Rdor3ZtV1rvW-gHX8sQSTo4WFyrA",
  authDomain: "xcs-v2.firebaseapp.com",
  projectId: "xcs-v2",
  storageBucket: "xcs-v2.appspot.com",
  messagingSenderId: "14083520042",
  appId: "1:14083520042:web:66c6be95820ccdd6c83553",
  measurementId: "G-WWDP45MK4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default app;
export const initFirebase = () => {
  return app;
};
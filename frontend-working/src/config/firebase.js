// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrhm1i_ah_4QZ92zvi1FNSMevObs-cytY",
  authDomain: "barback-e9e6c.firebaseapp.com",
  projectId: "barback-e9e6c",
  storageBucket: "barback-e9e6c.firebasestorage.app",
  messagingSenderId: "251170911522",
  appId: "1:251170911522:web:f55b5e8778185ddaff617b",
  measurementId: "G-PTT088MMVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}
export { analytics };

// Development emulators (uncomment for local development)
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;
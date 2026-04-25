import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth/cordova";
import { getFirestore } from "firebase/firestore";

// The user will replace these with their actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBzMfDPtLjD-Fg_cX6VaUqQCVm9hGTxRks",
  authDomain: "bijli-buddy-app.firebaseapp.com",
  projectId: "bijli-buddy-app",
  storageBucket: "bijli-buddy-app.firebasestorage.app",
  messagingSenderId: "1014977652824",
  appId: "1:1014977652824:web:dbebe859304c0c4e28422d",
  measurementId: "G-8K37BE1GNK"
};

// Reuse existing app instance during fast refresh / re-bundles.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: ReturnType<typeof getAuth> | null = null;

const getFirebaseAuth = () => {
  if (authInstance) {
    return authInstance;
  }

  authInstance = getAuth(app);

  return authInstance;
};

// Initialize Firestore
const db = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();

export { app, getFirebaseAuth, db, googleProvider };

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// eslint-disable-next-line import/no-mutable-exports, @typescript-eslint/no-explicit-any
export let db: firebase.firestore.Firestore = null as any;
// eslint-disable-next-line import/no-mutable-exports, @typescript-eslint/no-explicit-any
export let auth: firebase.auth.Auth = null as any;

export function initializeFirebase(): firebase.app.App {
  const app0 = firebase.apps.find((v) => v.name === "[DEFAULT]");
  if (app0) {
    return app0;
  }

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_apiKey,
    authDomain: process.env.REACT_APP_FIREBASE_authDomain,
    projectId: process.env.REACT_APP_FIREBASE_projectId,
    storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
    messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
    appId: process.env.REACT_APP_FIREBASE_appId,
  };
  const app = firebase.initializeApp(firebaseConfig);

  db = app.firestore();
  auth = app.auth();

  const inLocalDev = window.location.hostname === "localhost";
  if (inLocalDev) {
    auth.useEmulator("http://localhost:9099");
    // functions.useEmulator("localhost", 5001);
    db.useEmulator("localhost", 8080);
  }

  return app;
}

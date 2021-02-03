import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { isProd } from "../shared/env";

export type DocumentReference<
  T = firebase.firestore.DocumentData
> = firebase.firestore.DocumentReference<T>;

export type CollectionReference<
  T = firebase.firestore.DocumentData
> = firebase.firestore.CollectionReference<T>;

export type Query<
  T = firebase.firestore.DocumentData
> = firebase.firestore.Query<T>;

export class Timestamp extends firebase.firestore.Timestamp {}

export const zeroTimestamp = new Timestamp(0, 0);

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
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  const app = firebase.initializeApp(firebaseConfig);

  db = app.firestore();
  auth = app.auth();

  if (!isProd) {
    auth.useEmulator("http://localhost:9099");
    // functions.useEmulator("localhost", 5001);
    db.useEmulator("localhost", 8080);
  }

  return app;
}

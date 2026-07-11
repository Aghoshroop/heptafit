import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let app: App;

function getFirebaseAdminApp(): App {
  if (app) return app;

  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error("❌ FIREBASE_PROJECT_ID is missing from .env.local");
  }

  if (!clientEmail) {
    throw new Error("❌ FIREBASE_CLIENT_EMAIL is missing from .env.local");
  }

  if (!privateKey) {
    throw new Error("❌ FIREBASE_PRIVATE_KEY is missing from .env.local");
  }

  console.log("🔥 Initializing Firebase Admin...");
  console.log("Project:", projectId);
  console.log("Client Email:", clientEmail);
  console.log("Private Key Loaded:", !!privateKey);

  app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });

  console.log("✅ Firebase Admin initialized successfully.");

  return app;
}

export const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    const db = getFirestore(getFirebaseAdminApp());
    const value = (db as any)[prop];
    return typeof value === "function" ? value.bind(db) : value;
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    const auth = getAuth(getFirebaseAdminApp());
    const value = (auth as any)[prop];
    return typeof value === "function" ? value.bind(auth) : value;
  },
});
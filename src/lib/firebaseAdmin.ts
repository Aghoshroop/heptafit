import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App | undefined;

function getFirebaseAdminApp() {
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }
  
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      app = initializeApp({ credential: cert(serviceAccount) });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON", e);
      app = initializeApp(); // Fallback
    }
  } else {
    console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing in environment variables.");
    app = initializeApp();
  }
  
  return app;
}

export const adminDb = new Proxy({} as Firestore, {
  get(target, prop: string | symbol) {
    const db = getFirestore(getFirebaseAdminApp());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (db as any)[prop];
    return typeof val === 'function' ? val.bind(db) : val;
  }
});

export const adminAuth = new Proxy({} as Auth, {
  get(target, prop: string | symbol) {
    const auth = getAuth(getFirebaseAdminApp());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (auth as any)[prop];
    return typeof val === 'function' ? val.bind(auth) : val;
  }
});

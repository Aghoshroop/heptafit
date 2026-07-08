import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Protect against multiple initializations in development
if (!getApps().length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Parse the JSON string
      const serviceAccount = JSON.parse(serviceAccountKey);
      
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing in environment variables.");
      // Fallback for default initialization if deployed in GCP (e.g. Cloud Run, Vercel with specific setups)
      initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();

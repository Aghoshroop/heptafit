import * as admin from 'firebase-admin';

// Protect against multiple initializations in development
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Parse the JSON string
      const serviceAccount = JSON.parse(serviceAccountKey);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.warn("⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing in environment variables.");
      // Fallback for default initialization if deployed in GCP (e.g. Cloud Run, Vercel with specific setups)
      admin.initializeApp();
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

import fs from 'fs';

async function test() {
  try {
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    const match = envLocal.match(/FIREBASE_SERVICE_ACCOUNT_KEY=(.+)/);
    if (match) {
      let key = match[1].trim();
      if (key.startsWith('"') && key.endsWith('"')) {
        key = key.slice(1, -1);
      } else if (key.startsWith("'") && key.endsWith("'")) {
        key = key.slice(1, -1);
      }
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY = key;
    }
    
    console.log("Initializing Firestore Admin query...");
    const { adminDb } = await import('./src/lib/firebaseAdmin.ts');
    const invitesRef = adminDb.collection("coachInvitations");
    const snapshot = await invitesRef.where("invitationCode", "==", "TESTING").get();
    console.log("Success! snapshot empty?", snapshot.empty);
  } catch (error: any) {
    console.error("Caught error:");
    console.error(error.message);
    console.error(error.stack);
  }
}

test();

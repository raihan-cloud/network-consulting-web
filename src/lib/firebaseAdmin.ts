import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

let firebaseAdminApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseAdminApp) return firebaseAdminApp;

  // Hanya jalankan di server-side
  if (typeof window === 'undefined') {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Cek apakah semua variable ada
    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin credentials not configured');
      return null;
    }

    const apps = getApps();
    
    if (apps.length === 0) {
      try {
        firebaseAdminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        return null;
      }
    } else {
      firebaseAdminApp = apps[0];
    }
  }

  return firebaseAdminApp;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseAdmin();
  if (!app) return null;
  return getAuth(app);
}
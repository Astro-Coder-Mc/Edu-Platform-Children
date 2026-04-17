import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, terminate } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Simple validation to prevent crashes locally
const isValidConfig = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.projectId;

const app = initializeApp(isValidConfig ? firebaseConfig : {
  apiKey: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
});

// Use initializeFirestore with long polling to avoid WebSocket issues in iframes
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, (isValidConfig && firebaseConfig.firestoreDatabaseId) || undefined);

export const auth = getAuth(app);

// Error Handling Spec for Firestore Operations
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test as per system instructions
async function testConnection() {
  try {
    // Try to fetch a non-existent doc to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore connection successful.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
    // Skip logging for other errors during test
  }
}

testConnection();

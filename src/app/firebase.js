import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getDatabase } from "firebase/database";
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};


const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = firebase.auth();
const storage = firebase.storage();

export { db };
export { firebase };
export { auth };
export { storage };
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// Returns the Auth instance bound to the default Firebase app
export const firebaseAuth = getAuth();

// Returns the Firestore instance bound to the default Firebase app
export const db = getFirestore();
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // resto de tu config
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

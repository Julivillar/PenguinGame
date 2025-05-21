import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import type { Unsubscribe } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';


type PlayerContextType = {
  localPlayerId: string | null;
  displayName: string | null;
  saveDisplayName: (name: string) => Promise<void>;
  firebaseAuth: any
  db: any
};
const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const firebaseAuth = getAuth();
  const db = getFirestore();

  // 1️⃣ Listen for auth state
  useEffect(() => {
    const unsubscribeAuth = firebaseAuth.onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        setLocalPlayerId(user ? user.uid : null);
      }
    );
    return unsubscribeAuth;
  }, []);
  // 2️⃣ When we have a UID, subscribe to users/{uid}
  useEffect(() => {
    let unsubscribeUser: Unsubscribe | undefined;
    if (localPlayerId) {
      const userDoc = db.collection('users').doc(localPlayerId);
      unsubscribeUser = userDoc.onSnapshot(snap => {
        setDisplayName(snap.exists() ? (snap.data()?.name as string) : null);
      });
    } else {
      setDisplayName(null);
    }
    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [localPlayerId]);

  // 3️⃣ Method to save the name
  const saveDisplayName = async (name: string) => {
    if (!localPlayerId) throw new Error('No user logged in');
    await db
      .collection('users')
      .doc(localPlayerId)
      .set({ name }, { merge: true });
  };

  return (
    <PlayerContext.Provider
      value={{ localPlayerId, displayName, saveDisplayName, firebaseAuth, db }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used inside <PlayerProvider>');
  }
  return context;
};

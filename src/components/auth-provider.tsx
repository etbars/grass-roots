"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseEnabled } from "@/lib/firebase";

export type UserRole = "student" | "teacher" | "host";

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  roles: UserRole[];
  /** Static host-site ids this user stewards (for the host dashboard). */
  hostSites: string[];
}

interface AuthValue {
  enabled: boolean;
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  setRoles: (roles: UserRole[]) => Promise<void>;
  setHostSites: (hostSites: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Track the signed-in Firebase user.
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Mirror the user's profile doc (creating it on first sign-in).
  useEffect(() => {
    if (!db || !user) {
      setProfile(null);
      return;
    }
    const ref = doc(db, "users", user.uid);
    return onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        void setDoc(ref, {
          displayName: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
          roles: [],
          createdAt: serverTimestamp(),
        });
        return;
      }
      const data = snap.data();
      setProfile({
        uid: user.uid,
        displayName: data.displayName ?? user.displayName ?? "",
        email: data.email ?? user.email ?? "",
        photoURL: data.photoURL ?? user.photoURL ?? "",
        roles: (data.roles as UserRole[]) ?? [],
        hostSites: (data.hostSites as string[]) ?? [],
      });
    });
  }, [user]);

  async function signIn() {
    if (!auth) return;
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function signOutUser() {
    if (auth) await signOut(auth);
  }

  async function setRoles(roles: UserRole[]) {
    if (!db || !user) return;
    await setDoc(doc(db, "users", user.uid), { roles }, { merge: true });
  }

  async function setHostSites(hostSites: string[]) {
    if (!db || !user) return;
    await setDoc(doc(db, "users", user.uid), { hostSites }, { merge: true });
  }

  return (
    <AuthContext.Provider
      value={{
        enabled: firebaseEnabled,
        user,
        profile,
        loading,
        signIn,
        signOutUser,
        setRoles,
        setHostSites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

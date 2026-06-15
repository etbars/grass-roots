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
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseEnabled } from "@/lib/firebase";
import { AuthModal } from "@/components/auth-modal";

export type UserRole = "student" | "teacher" | "host";

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  roles: UserRole[];
  /** Static host-site ids this user stewards (for the host dashboard). */
  hostSites: string[];
  /** Founding-member reservation (pre-launch credit intent), if any. */
  foundingTier?: string;
  foundingCredit?: number;
}

interface AuthValue {
  enabled: boolean;
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  setRoles: (roles: UserRole[]) => Promise<void>;
  setHostSites: (hostSites: string[]) => Promise<void>;
  /** Open/close the shared sign-in modal (email/password + Google). */
  openAuth: () => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  // Track the signed-in Firebase user. Close the sign-in modal once in.
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) setAuthOpen(false);
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
        foundingTier: data.foundingTier as string | undefined,
        foundingCredit: data.foundingCredit as number | undefined,
      });
    });
  }, [user]);

  async function signIn() {
    if (!auth) return;
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function signUpWithEmail(name: string, email: string, password: string) {
    if (!auth) return;
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = name.trim();
    if (displayName) await updateProfile(cred.user, { displayName });
    // Seed the profile doc with the name now, since onAuthStateChanged may have
    // created it before updateProfile resolved.
    if (db) {
      await setDoc(
        doc(db, "users", cred.user.uid),
        { displayName, email: cred.user.email ?? email },
        { merge: true },
      );
    }
  }

  async function signInWithEmail(email: string, password: string) {
    if (!auth) return;
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function resetPassword(email: string) {
    if (!auth) return;
    await sendPasswordResetEmail(auth, email);
  }

  function openAuth() {
    setAuthOpen(true);
  }
  function closeAuth() {
    setAuthOpen(false);
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
        signUpWithEmail,
        signInWithEmail,
        resetPassword,
        signOutUser,
        setRoles,
        setHostSites,
        openAuth,
        closeAuth,
      }}
    >
      {children}
      <AuthModal
        open={authOpen}
        onClose={closeAuth}
        signInWithGoogle={signIn}
        signInWithEmail={signInWithEmail}
        signUpWithEmail={signUpWithEmail}
        resetPassword={resetPassword}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

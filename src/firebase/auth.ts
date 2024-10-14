import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

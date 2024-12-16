import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebase";
import { FirebaseError } from "firebase/app";
import { EmailCredentials } from "../app/types";
const provider = new GoogleAuthProvider();

type EmailAndPassword = {
  email: string;
  password: string;
};
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signUpWithEmail = async (
  credentials: EmailCredentials
): Promise<void> => {
  const { email, password } = credentials;
  try {
    const auth = getAuth();

    // ユーザーの作成
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User created:", userCredential.user);

    // メール認証の送信
    await sendEmailVerification(userCredential.user);
  } catch (error) {
    if (error instanceof FirebaseError) {
    } else {
      console.error("Error signing up with email:", error);
    }
    throw error; // 必要に応じて上位で処理
  }
};

export const signInwithEmail = async (
  credentials: EmailCredentials
): Promise<void> => {
  const { email, password } = credentials;
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Firebase error:", error.message);
    }
  }
};

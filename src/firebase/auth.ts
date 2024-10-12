import { auth } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Google認証プロバイダーのインスタンスを作成
const provider = new GoogleAuthProvider();

// Googleでサインイン
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

// サインアウト
export const logout = () => {
  return signOut(auth);
};

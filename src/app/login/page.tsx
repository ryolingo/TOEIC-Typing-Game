// app/login/page.tsx
"use client";
import { signInWithGoogle } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Googleサインイン失敗:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">サインイン</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

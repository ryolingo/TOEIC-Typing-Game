"use client";
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase"; // Firebase authのインポート
import { onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [userId, setUserId] = useState<string | null>(null); // userIdを管理
  const router = useRouter();

  useEffect(() => {
    // Firebase Authでログイン状態を監視してuserIdを取得
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // ログインしているユーザーのuserIdをセット
      } else {
        setUserId(null); // ログアウト状態
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUserId(null);
      router.push("/login");
    });
  };

  const handleMypage = () => {
    if (userId) {
      router.push(`/mypage/${userId}`); // userIdをURLに含めて遷移
    } else {
      router.push("/login"); // ログインしていない場合はログインページに遷移
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Typing App
        </Typography>
        <Button color="inherit" onClick={() => router.push("/")}>
          Home
        </Button>
        <Button color="inherit" onClick={handleMypage}>
          Mypage
        </Button>
        <Button color="inherit" onClick={() => router.push("/levelselect")}>
          Game
        </Button>
        {userId ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={() => router.push("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

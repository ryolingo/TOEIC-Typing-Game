"use client";

import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation"; // ルーターを使用してページ遷移を実装

export default function Home() {
  const router = useRouter();

  const handlePlayGame = () => {
    router.push("/levelselect"); // PlayGameボタンでLevelselectページに遷移
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundColor: "#f0f0f0", // 背景色を設定（必要に応じて変更）
        padding: "20px",
      }}
    >
      {/* TOEIC GAME タイトル */}
      <Typography variant="h2" gutterBottom>
        TOEIC GAME
      </Typography>

      {/* 英語の名言 */}
      <Typography variant="h6" color="textSecondary" gutterBottom>
        "The only way to do great work is to love what you do." – Steve Jobs
      </Typography>

      {/* PlayGame ボタン */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handlePlayGame}
        sx={{ marginTop: "40px" }}
      >
        PlayGame
      </Button>
    </Box>
  );
}

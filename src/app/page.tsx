"use client";

import React from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useRouter } from "next/navigation"; // ルーターを使用してページ遷移を実装
import { create } from "domain";

export default function Home() {
  const router = useRouter();

  const handlePlayGame = () => {
    router.push("/levelselect"); // PlayGameボタンでLevelselectページに遷移
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#455a64",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff7043",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: "1.1rem", // ボタンのフォントサイズ
            padding: "12px 24px", // パディングを大きめに
            borderRadius: "8px", // ボタンの角を少し丸める
            textTransform: "none", // テキストの大文字変換を無効に
            fontWeight: 600, // ボールドにして見やすく
            boxShadow: "0 3px 5px rgba(0,0,0,0.2)", // 軽いシャドウ
            "&:hover": {
              backgroundColor: "red", // ホバー時に少し濃い青に変更
            },
          },
          sizeLarge: {
            padding: "16px 32px", // size="large"時のパディングを調整
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
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
        <Card
          sx={{
            backgroundColor: "#f0f0f0",
            boxShadow: "none",
            mb: 7,
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
        </Card>
      </Box>
    </ThemeProvider>
  );
}

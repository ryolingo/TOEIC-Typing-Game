"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  createTheme,
  ThemeProvider,
  Grid,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { EmojiEvents, School, TrendingUp } from "@mui/icons-material";
import { wittyRemarks } from "./components/common/Wittyremarks";

export default function Home() {
  const router = useRouter();
  const [witty, setWitty] = useState<string>("");

  const setRandomwitty = () => {
    const randomIndex = Math.floor(Math.random() * wittyRemarks.length);
    setWitty(wittyRemarks[randomIndex]);
  };
  useEffect(() => {
    setRandomwitty();
  });

  const handlePlayGame = () => {
    router.push("/level");
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
            fontSize: "1.1rem",
            padding: "12px 24px",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor: "#37474f",
            },
          },
          sizeLarge: {
            padding: "16px 32px",
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
          backgroundColor: "#f0f0f0",
          padding: "20px",
        }}
      >
        <Card
          sx={{
            backgroundColor: "#f0f0f0",
            boxShadow: "none",
            mb: 7,
            padding: "20px",
          }}
        >
          {/* TOYPE タイトル */}
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            TOYPE
          </Typography>

          {/* 英語の名言 */}
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {witty}
          </Typography>

          {/* ゲームの簡単な説明 */}
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            TOEIC対策とタイピングスキルを同時に鍛える楽しいゲーム。挑戦して、あなたのスコアを高めよう！
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

        {/* 特徴セクション */}
        <Box sx={{ width: "100%", mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            TOYPEの特徴
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{ padding: "20px", textAlign: "center" }}
              >
                <EmojiEvents sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  目標達成
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  スコアを高め、目標を達成しましょう
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{ padding: "20px", textAlign: "center" }}
              >
                <School sx={{ fontSize: 40, color: "secondary.main" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  TOEIC対策
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  TOEIC頻出単語で実力アップ！
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={2}
                sx={{ padding: "20px", textAlign: "center" }}
              >
                <TrendingUp sx={{ fontSize: 40, color: "primary.main" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                  スコアの分析
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  過去のスコアを見直し、成長を実感！
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

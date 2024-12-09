"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  CircularProgress,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { useFetchUserData } from "@/app/hooks/user/useFetchUserData";
import { GameData } from "@/app/types";
import GameCard from "@/app/components/mypage/gamecard";
/// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: "#f5f5f5", // 落ち着いた青系のグレー
    },
    secondary: {
      main: "#fa8072", // 落ち着いたオレンジ
    },
    background: {
      default: "#fafafa",
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 6px 12px 0 rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #fa8072 30%,#f5f5f5  90%)",
          color: "#00000",
          padding: "16px",
        },
        title: {
          fontWeight: 600,
        },
      },
    },
  },
});

export default function Mypage() {
  const params = useParams();
  const userId = params.userId as string;
  const { gameDataList, loading } = useFetchUserData(
    Array.isArray(userId) ? userId[0] : userId
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", py: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: "md", mx: "auto" }}>
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "black", mb: 4 }}
          >
            Game History{" "}
          </Typography>
          {gameDataList.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="50vh"
            >
              <Typography variant="h5" color="text.secondary">
                No game data found for this user.
              </Typography>
            </Box>
          ) : (
            gameDataList.map((gameData: GameData) => (
              <GameCard key={gameData.gameId} gameData={gameData} />
            ))
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// import React from "react";
// import { fetchUserData } from "@/app/lib/fetchUserData";
// import Mypage from "@/app/components/mypage/gamecard";

// export default async function UserMypage({
//   params,
// }: {
//   params: { userId: string };
// }) {
//   const userId = params.userId;
//   const gameDataList = await fetchUserData(userId);

//   return <Mypage gameDataList={gameDataList} />;
// }

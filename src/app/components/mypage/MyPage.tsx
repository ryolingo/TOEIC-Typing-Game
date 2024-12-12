// components/mypage/Mypage.tsx
"use client";

import React from "react";
import GameCard from "@/app/components/mypage/gamecard";
import {
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f5f5f5",
    },
    secondary: {
      main: "#fa8072",
    },
    background: {
      default: "#fafafa",
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

const Mypage = ({ gameDataList }: { gameDataList: any[] }) => {
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
            Game History
          </Typography>
          {gameDataList.length === 0 ? (
            <Typography variant="h5" color="text.secondary">
              No game data found for this user.
            </Typography>
          ) : (
            gameDataList.map((gameData) => (
              <GameCard key={gameData.gameId} gameData={gameData} />
            ))
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Mypage;

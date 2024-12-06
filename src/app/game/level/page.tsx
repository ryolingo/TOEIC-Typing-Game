"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  Grid,
} from "@mui/material";
import { levels } from "@/app/components/level/levels";
import Cards from "@/app/components/level/zoom";
import LevelHeader from "@/app/components/level/levelheader";

// カスタムテーマの作成
let theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

theme = responsiveFontSizes(theme);

// スタイル付きコンポーネント

export default function LevelSelect() {
  const router = useRouter();

  const handleLevelSelect = (level: string) => {
    router.push(`/gaming?level=${level}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "background.default",
          py: 4,
        }}
      >
        <LevelHeader />
        <Grid container spacing={4} justifyContent="center">
          {levels.map((level) => (
            <Grid item xs={12} sm={6} md={3} key={level.id}>
              <Cards
                name={level.name}
                description={level.description}
                color={level.color}
                onClick={() => handleLevelSelect(level.name)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

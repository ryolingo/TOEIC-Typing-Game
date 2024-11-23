"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  Grid,
  Grow,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/system";

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
const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
  },
}));

const LevelButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 600,
}));

export default function LevelSelect() {
  const router = useRouter();

  const handleLevelSelect = (level: string) => {
    router.push(`game/gaming?level=${level}`);
  };

  const levels = [
    { name: "Easy", description: "Perfect for beginners", color: "#4caf50" },
    {
      name: "Medium",
      description: "For intermediate typers",
      color: "#ff9800",
    },
    { name: "Hard", description: "Challenge yourself", color: "#f44336" },
    {
      name: "Advanced",
      description: "For the ultimate challenge",
      color: "#9c27b0",
    },
  ];

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
        <Grow in={true} timeout={1000}>
          <Typography variant="h3" sx={{ mb: 6, textAlign: "center" }}>
            Select Your Challenge
          </Typography>
        </Grow>
        <Grid container spacing={4} justifyContent="center">
          {levels.map((level, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Zoom in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                <StyledCard>
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2, color: level.color }}>
                      {level.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {level.description}
                    </Typography>
                    <LevelButton
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleLevelSelect(level.name.toLowerCase())
                      }
                      fullWidth
                    >
                      Start
                    </LevelButton>
                  </CardContent>
                </StyledCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

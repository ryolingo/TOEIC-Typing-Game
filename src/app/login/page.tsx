"use client";

import React, { useEffect } from "react";
import { signInWithGoogle } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import {
  Box,
  Button,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000", // ボタン用の黒色
      contrastText: "#ffffff", // テキストを白に
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    h4: {
      fontWeight: 700,
      color: "#333333",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1.1rem",
          padding: "10px 20px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
      },
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ width: "100%", textAlign: "center" }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              サインインして始めましょう
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleGoogleSignIn}
                startIcon={<GoogleIcon />}
              >
                Sign in with Google
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

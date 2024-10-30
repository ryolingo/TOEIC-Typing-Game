"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useFetchUserData } from "@/app/hooks/useFetchUserData";
import { GameData } from "@/app/types";

/// カスタムテーマの作成
const theme = createTheme({
  palette: {
    primary: {
      main: "#455a64", // 落ち着いた青系のグレー
    },
    secondary: {
      main: "#ff7043", // 落ち着いたオレンジ
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
          background: "linear-gradient(135deg, #455a64 30%, #ff7043 90%)",
          color: "#ffffff",
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
            Your History
          </Typography>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="50vh"
            >
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : gameDataList.length === 0 ? (
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
            gameDataList.map((gameData: GameData, index) => (
              <Card key={index} sx={{ mb: 3, overflow: "hidden" }}>
                <CardHeader
                  title={`Game ${index + 1}`}
                  subheader={new Date(
                    gameData.timestamp.toDate()
                  ).toLocaleString()}
                />
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Chip
                      label={`Score: ${gameData.score}`}
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    />
                    <Chip
                      label={`Level: ${gameData.level}`}
                      color="secondary"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>

                  {gameData.incorrectWords &&
                    gameData.incorrectWords.length > 0 && (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${index}-content`}
                          id={`panel${index}-header`}
                        >
                          <Typography
                            sx={{
                              fontWeight: "medium",
                              color: "text.secondary",
                            }}
                          >
                            間違えた単語 ({gameData.incorrectWords.length})
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            component="ul"
                            sx={{ p: 0, m: 0, listStyle: "none" }}
                          >
                            {gameData.incorrectWords.map((word, wordIndex) => (
                              <Box
                                component="li"
                                key={wordIndex}
                                sx={{
                                  py: 1,
                                  borderBottom:
                                    wordIndex <
                                    gameData.incorrectWords.length - 1
                                      ? 1
                                      : 0,
                                  borderColor: "divider",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: "medium",
                                    color: "text.primary",
                                  }}
                                >
                                  {word.word}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  {word.meaning}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

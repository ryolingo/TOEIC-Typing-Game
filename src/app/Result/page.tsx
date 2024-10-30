"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  createTheme,
  Paper,
  Button,
} from "@mui/material";
import { EmojiEvents, SportsScore, School, Error } from "@mui/icons-material";
import { useFetchGameData } from "../hooks/useFetchGameData";

const theme = createTheme({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#f50057" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: "12px" },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default function GameResultPage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || "";
  const router = useRouter();

  const { incorrectWords, gameData, loading } = useFetchGameData(gameId);

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

  const navigateToLevelSelect = () => {
    router.push("/levelselect");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Box
          className="container"
          sx={{ maxWidth: "lg", mx: "auto", px: { xs: 2, sm: 3 } }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 4, color: "primary.main" }}
          >
            <EmojiEvents sx={{ mr: 1, verticalAlign: "bottom" }} />
            Game Result
          </Typography>

          {gameData && (
            <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: "12px" }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <SportsScore
                      sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                    />
                    <Typography variant="h5" component="p">
                      Score: {gameData.score}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <School
                      sx={{ fontSize: 40, color: "secondary.main", mr: 2 }}
                    />
                    <Typography variant="h5" component="p">
                      Level: {gameData.level}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {incorrectWords.length > 0 && (
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Error sx={{ mr: 1, color: "error.main" }} />
                  Incorrect Words
                </Typography>
                <List>
                  {incorrectWords.map((word, index) => (
                    <ListItem
                      key={index}
                      divider={index !== incorrectWords.length - 1}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            component="span"
                            fontWeight="medium"
                          >
                            {word.word}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {word.meaning}
                          </Typography>
                        }
                      />
                      <Chip
                        label={`Word ${index + 1}`}
                        color="primary"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={navigateToLevelSelect}
            >
              Select Level
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

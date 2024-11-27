"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Typography,
  TextField,
  Container,
  Paper,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { wordsList } from "../components/game/WordList";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export default function TypingGame() {
  const [gameId] = useState(uuidv4());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState("");
  const searchParams = useSearchParams();
  const [meaning, setMeaning] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [mistyped, setMistyped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [savedIncorrectWords, setSavedIncorrectWords] = useState(new Set());
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const level = searchParams.get("level") || "easy";
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const saveGameData = async (finalScore: number) => {
    if (!userId) return;
    try {
      const gameRef = doc(db, "GameData", gameId);
      await setDoc(gameRef, {
        userId,
        gameId,
        score: finalScore,
        level,
        timestamp: new Date(),
      });
      console.log("Game metadata saved successfully with gameId: ", gameId);
    } catch (e) {
      console.error("Error adding game data: ", e);
    }
  };

  const saveIncorrectWord = async (
    word: string,
    meaning: string,
    score: number
  ) => {
    if (!userId) return;
    try {
      const gameRef = doc(db, "GameData", gameId);
      const incorrectWordsRef = collection(gameRef, "incorrectWords");
      await addDoc(incorrectWordsRef, {
        word,
        meaning,
        score,
        timestamp: new Date(),
        userId,
      });
      console.log("Incorrect word saved successfully for gameId: ", gameId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const setRandomWord = () => {
    const levelWords =
      wordsList[level as keyof typeof wordsList] || wordsList.easy;
    const randomIndex = Math.floor(Math.random() * levelWords.length);
    const randomWord = levelWords[randomIndex];
    setWord(randomWord.word);
    setMeaning(randomWord.meaning);
    setUserInput("");
  };

  // 音声ファイルをuseRefで管理
  useEffect(() => {
    typingSoundRef.current = new Audio("/sounds/typing-sound.mp3");
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // 正しい部分一致の場合のみ入力を反映
    if (value === word.slice(0, value.length)) {
      setUserInput(value); // 正しい入力のみ更新
      setMistyped(false); // ミス状態を解除

      if (typingSoundRef.current) {
        typingSoundRef.current.currentTime = 0; // サウンドの再生位置をリセット
        typingSoundRef.current.play(); // タイピング音を再生
      }

      if (value === word) {
        setScore((prev) => prev + 1);
        setUserInput("");
        setMistyped(false);
        setRandomWord();
        <a href=""></a>;
        setSavedIncorrectWords(new Set());
      }
    } else {
      // ミスタイプ時の処理
      if (!mistyped) {
        setMistyped(true);

        // ミスタイプを保存し、重複を防ぐためセットへ追加
        if (!savedIncorrectWords.has(word)) {
          saveIncorrectWord(word, meaning, score);
          setSavedIncorrectWords((prev) => new Set(prev.add(word)));
        }
      }
    }
  };
  const scoreRef = useRef(score);

  useEffect(() => {
    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      setRandomWord();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [countdown, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameOver(true);
            saveGameData(scoreRef.current);
            router.push(
              `game/results?score=${scoreRef.current}&gameId=${gameId}&level=${level}`
            );
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStarted, gameId, level, router]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ mt: "10rem" }}>
          {countdown > 0 ? (
            <Typography variant="h1" align="center">
              {countdown}
            </Typography>
          ) : (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                Time: {timer} seconds
              </Typography>
              <Typography variant="h4" gutterBottom>
                Score: {score}
              </Typography>
              <Typography variant="h5" gutterBottom>
                {meaning}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {word.split("").map((char, index) => {
                  let color = "text.primary";
                  if (index < userInput.length) {
                    color =
                      char === userInput[index] ? "success.main" : "error.main";
                  }
                  return (
                    <Typography
                      key={index}
                      variant="h4"
                      component="span"
                      sx={{ color }}
                    >
                      {char}
                    </Typography>
                  );
                })}
              </Box>
              <TextField
                inputRef={inputRef}
                fullWidth
                value={userInput}
                onChange={handleInputChange}
                disabled={timer === 0}
                variant="outlined"
                inputProps={{
                  style: { fontSize: "24px", padding: "10px" },
                }}
                autoFocus
              />
            </Paper>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import { db } from "@/firebase/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

export default function ScorePage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") || "0"; // スコアを取得
  const gameId = searchParams.get("gameId"); // gameIdをクエリパラメータから取得
  const level = searchParams.get("level");
  const router = useRouter();

  const [incorrectWords, setIncorrectWords] = useState<
    { word: string; meaning: string }[]
  >([]);

  // Firestoreから間違えた単語を取得
  useEffect(() => {
    const fetchIncorrectWords = async () => {
      if (gameId) {
        // gameIdが存在する場合のみクエリを実行
        try {
          const q = query(
            collection(db, "incorrectWords"),
            where("gameId", "==", gameId)
          );
          const querySnapshot = await getDocs(q);
          const words = querySnapshot.docs.map((doc) => ({
            word: doc.data().word,
            meaning: doc.data().meaning,
          }));
          setIncorrectWords(words);
        } catch (error) {
          console.error("Error fetching incorrect words: ", error);
        }
      }
    };

    fetchIncorrectWords();
  }, [gameId]);

  const handlePlayAgain = () => {
    router.push(`/Game?level=${level}`); // ゲームページに遷移
  };

  const handleReplayGame = () => {
    router.push(`/ReGame?&gameId=${gameId}&level=${level}`);
  };
  const handleLevelSelect = () => {
    router.push(`/LevelSelect`);
  };
  const handleMypage = () => {
    router.push(`/Mypage`);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Typography
            variant="h4"
            component="h2"
            className="text-center font-bold"
          >
            Game Result
          </Typography>
        </CardHeader>
        <CardContent className="text-center">
          <Typography variant="h2" component="p" className="mb-4 font-bold">
            {score}
          </Typography>
          <Typography variant="body1" component="p" className="mb-6">
            Great job! You've completed the typing game.
          </Typography>

          {/* 間違えた単語のリストを表示 */}
          {incorrectWords.length > 0 && (
            <div className="mb-6">
              <Typography variant="h6" component="p" className="font-bold">
                Incorrect Words:
              </Typography>
              <ul>
                {incorrectWords.map((item, index) => (
                  <li key={index}>
                    {item.word} - {item.meaning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="contained" color="primary" onClick={handlePlayAgain}>
            Play Again
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReplayGame}
          >
            Play Regame
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleLevelSelect}
          >
            Level
          </Button>
          <Button variant="contained" color="primary" onClick={handleMypage}>
            Mypage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

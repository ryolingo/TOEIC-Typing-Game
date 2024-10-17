// app/Score/page.tsx
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
import { getDocs, collection } from "firebase/firestore";

export default function ScorePage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") || "0"; // スコアを取得、取得できなければ"0"に設定
  const router = useRouter();

  // 間違えた単語リストの状態を管理
  const [incorrectWords, setIncorrectWords] = useState<
    { word: string; meaning: string }[]
  >([]);

  // Firestoreから間違えた単語を取得
  useEffect(() => {
    const fetchIncorrectWords = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "IncorrectWords"));
        const words = querySnapshot.docs.map((doc) => ({
          word: doc.data().word,
          meaning: doc.data().meaning,
        }));
        setIncorrectWords(words);
      } catch (error) {
        console.error("Error fetching incorrect words: ", error);
      }
    };

    fetchIncorrectWords();
  }, []);

  const handlePlayAgain = () => {
    router.push("/Game"); // ゲームページに遷移
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
        </CardContent>
      </Card>
    </div>
  );
}

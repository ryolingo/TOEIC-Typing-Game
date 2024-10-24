"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import { useFetchGameData } from "../hooks/useFetchGameData"; // フックをインポート

export default function ScorePage() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId") || ""; // gameIdをクエリパラメータから取得
  const router = useRouter();

  // カスタムフックを使って間違えた単語を取得
  const { incorrectWords, gameData, loading } = useFetchGameData(gameId);

  // ゲームデータが存在すればそれを優先、なければクエリパラメータから取得
  const score = gameData?.score || searchParams.get("score") || "0";
  const level = gameData?.level || searchParams.get("level");

  const handlePlayAgain = () => {
    router.push(`/Game?level=${level}`); // ゲームページに遷移
  };

  const handleReplayGame = () => {
    router.push(`/ReGame?gameId=${gameId}&level=${level}`);
  };

  const handleLevelSelect = () => {
    router.push(`/LevelSelect`);
  };

  const handleMypage = () => {
    router.push(`/Mypage?gameId=${gameId}`);
  };

  if (loading) {
    return <p>Loading...</p>; // ローディング中の表示
  }

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

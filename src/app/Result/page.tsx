// app/Score/page.tsx
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

export default function ScorePage() {
  const searchParams = useSearchParams();
  const score = searchParams.get("score") || "0"; // スコアを取得、取得できなければ"0"に設定
  const router = useRouter();

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
          <Button variant="contained" color="primary" onClick={handlePlayAgain}>
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

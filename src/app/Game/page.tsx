"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { wordsList } from "../conponents/WordList";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardHeader,
  Typography,
  CardContent,
  Input,
} from "@mui/material";

const TypingGame = () => {
  // ゲームの状態
  const [gameId] = useState(uuidv4());
  const [word, setWord] = useState("");
  const searchParams = useSearchParams();
  const [meaning, setMeaning] = useState("");
  const [userInput, setUserInput] = useState(""); // ユーザーの入力
  const [score, setScore] = useState(0); // スコア管理
  const [timer, setTimer] = useState(60); // タイマーを60秒に設定
  const level = searchParams.get("level") || "easy";
  const [mistyped, setMistyped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scoreRef = useRef(score);

  const getLevelWords = () => {
    return wordsList[level as keyof typeof wordsList] || wordsList.easy;
  };

  // ランダムな単語を設定する関数
  const setRandomWord = () => {
    const levelWords = getLevelWords();
    const randomIndex = Math.floor(Math.random() * levelWords.length);
    const randomWord = levelWords[randomIndex];
    setWord(randomWord.word);
    setMeaning(randomWord.meaning);
    setUserInput(""); // 新しい単語が出たら入力をクリア
    setMistyped(false); // ミスタイプフラグをリセット
  };

  // 間違えた単語を保存する関数
  const saveIncorrectWord = async (word: string) => {
    try {
      await addDoc(collection(db, "incorrectWords"), {
        word,
        meaning,
        gameId, // gameIdを保存
        level, // levelも保存
        timestamp: new Date(),
      });
    } catch (e) {
      console.error("Error adding incorrect word: ", e);
    }
  };

  // ゲームのメタデータを保存する関数
  const saveGameData = async () => {
    try {
      await addDoc(collection(db, "GameData"), {
        gameId,
        level,
        score, // スコアはuseRefで管理しているスコアを保存
        timestamp: new Date(),
      });
    } catch (e) {
      console.error("Error adding game data: ", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInput(value);

    if (!mistyped && value !== word.slice(0, value.length)) {
      setMistyped(true);
      saveIncorrectWord(word);
    }

    if (value === word) {
      setScore((prevScore) => prevScore + 1);
      setRandomWord();
      setUserInput("");
    }
  };

  //単語の表示を作成（正解した部分は強調）
  const renderWord = () => {
    return word.split("").map((char, index) => {
      let color = "black"; // デフォルトは黒
      if (index < userInput.length) {
        color = char === userInput[index] ? "green" : "red"; // 正解は緑、不正解は赤
      }
      return (
        <span key={index} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  useEffect(() => {
    setRandomWord();
    if (inputRef.current) {
      inputRef.current.focus(); // ページが読み込まれたときに自動でフォーカス
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // タイマーを停止
          setGameOver(true);
          return prev;
        }
        return prev - 1;
      });
    }, 100); // タイマーを1秒に設定

    return () => clearInterval(interval);
  }, []);

  // タイマーが0になった時にページ遷移
  useEffect(() => {
    if (gameOver) {
      saveGameData(); // ゲームデータを保存
      router.push(`/Result?score=${score}&gameId=${gameId}&level=${level}`);
    }
  }, [gameOver, router, scoreRef, gameId, level]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Typography variant="h4" className="text-center">
            Typing Game
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography variant="h6" className="text-center mb-4">
            Time: {timer} seconds
          </Typography>
          <Typography variant="h6" className="text-center mb-4">
            Score: {score}
          </Typography>
          <Typography variant="body1" className="text-center mb-4">
            {meaning}
          </Typography>
          <div className="text-center mb-4">{renderWord()}</div>
          <Input
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="w-full p-2 text-lg"
            disabled={timer === 0}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingGame;

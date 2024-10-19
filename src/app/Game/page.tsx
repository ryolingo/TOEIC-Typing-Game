"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { wordsList } from "../conponents/WordList";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { v4 as uuidv4 } from "uuid";

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
  const saveIncorrectWord = async (
    word: string,
    gameId: string,
    score: number
  ) => {
    try {
      await addDoc(collection(db, "incorrectWords"), {
        word,
        timestamp: new Date(),
        score,
        gameId,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInput(value);

    if (!mistyped && value !== word.slice(0, value.length)) {
      setMistyped(true);
      saveIncorrectWord(word, gameId, score);
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
    }, 1000); // タイマーを1秒に設定

    return () => clearInterval(interval);
  }, []);

  // タイマーが0になった時にページ遷移
  useEffect(() => {
    if (gameOver) {
      router.push(`/Result?score=${score}&gameId=${gameId}&level=${level}`);
    }
  }, [gameOver, router, scoreRef, gameId, level]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Typing Game</h1>
      <h2>Time: {timer} seconds</h2>
      <h2>Score: {score}</h2>
      <h2>
        <p>{meaning}</p>
        <div>{renderWord()}</div>
      </h2>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        style={{ fontSize: "24px", padding: "10px", width: "300px" }}
        disabled={timer === 0}
      />
    </div>
  );
};

export default TypingGame;

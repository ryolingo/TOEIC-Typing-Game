"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { wordsList } from "../conponents/WordList";

const TypingGame = () => {
  // ゲームの状態
  const [currentWord, setCurrentWord] = useState(""); // 現在の表示される単語
  const [typedWord, setTypedWord] = useState(""); // プレイヤーが入力した単語
  const [score, setScore] = useState(0); // スコア管理
  const [timer, setTimer] = useState(60); // タイマーを60秒に設定
  const router = useRouter();

  // フォーカス管理用のref
  const inputRef = useRef<HTMLInputElement>(null);

  // ゲーム開始時に最初の単語をセットし、タイマーを開始
  useEffect(() => {
    setRandomWord();
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // タイマーを停止
          alert("Finish!");
          router.push("/Result"); // 結果ページに遷移
        }
        return prev - 1;
      });
    }, 10);

    return () => clearInterval(interval); // クリーンアップ用
  }, []);

  // 単語の生成
  const setRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    setCurrentWord(wordsList[randomIndex]);
    setTypedWord(""); // プレイヤーの入力をリセット
  };

  // キー入力ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTypedWord(value);

    // 正解判定
    if (value === currentWord) {
      setScore(score + 1); // スコアを更新
      setRandomWord(); // 次の単語に移行
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Typing Game</h1>
      <h2>Time: {timer} seconds</h2>
      <h2>Score: {score}</h2>
      <h2>
        Type this word: <span style={{ color: "blue" }}>{currentWord}</span>
      </h2>
      <input
        ref={inputRef}
        type="text"
        value={typedWord}
        onChange={handleChange}
        style={{ fontSize: "24px", padding: "10px" }}
        disabled={timer === 0} // タイマーが0なら入力を無効化
      />
    </div>
  );
};

export default TypingGame;

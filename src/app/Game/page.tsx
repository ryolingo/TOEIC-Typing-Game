"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { wordsList } from "../conponents/WordList";

const TypingGame = () => {
  // ゲームの状態
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [userInput, setUserInput] = useState(""); // 修正：useInput -> userInput
  const [score, setScore] = useState(0); // スコア管理
  const [timer, setTimer] = useState(60); // タイマーを60秒に設定
  const router = useRouter();

  // フォーカス管理用のref
  const inputRef = useRef<HTMLInputElement>(null);

  // ランダムな単語を設定する関数
  const setRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    const randomWord = wordsList[randomIndex];
    setWord(randomWord.word);
    setMeaning(randomWord.meaning);
    setUserInput(""); // 新しい単語が出たら入力をクリア
  };

  // ユーザーの入力を管理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // 正しい部分だけ入力できるようにする
    if (value === word.slice(0, value.length)) {
      setUserInput(value); // 正しい部分だけを更新

      // 単語が完全に一致したら次の単語に移行
      if (value === word) {
        setScore((prevScore) => prevScore + 1); // スコアを更新
        setRandomWord(); // 次の単語に移行
      }
    }
  };

  // 単語の表示を作成（正解した部分は強調）
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
  const scoreRef = useRef(score);

  useEffect(() => {
    setRandomWord();
    if (inputRef.current) {
      inputRef.current.focus(); // ページが読み込まれたときに自動でフォーカス
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // タイマーを停止
          alert("Finish!");
          router.push(`/Result?score=${scoreRef.current}`); // 結果ページに遷移
        }
        return prev - 1;
      });
    }, 1000); // タイマーを1秒に設定

    // useEffectのクリーンアップ関数
    return () => clearInterval(interval);
  }, []);

  // scoreが更新されるたびにscoreRef.currentも更新
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

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
        disabled={timer === 0} // タイマーが0なら入力を無効化
      />
    </div>
  );
};

export default TypingGame;

"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { wordsList } from "../conponents/WordList";

const TypingGame = () => {
  // ゲームの状態
  const [word, setWord] = useState("ESMAscript");
  const [userInput, setUserInput] = useState(""); // ユーザーの入力を管理
  const [score, setScore] = useState(0); // スコア管理
  const [timer, setTimer] = useState(60); // タイマーを60秒に設定
  const router = useRouter();

  // ランダムな単語を設定する関数
  const setRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    setWord(wordsList[randomIndex]);
    setUserInput(""); // 新しい単語が来るたびにユーザー入力をリセット
  };

  // 単語の表示を作成
  const renderWord = () => {
    return word.split("").map((char, index) => {
      let color = "black"; // 初期状態は黒色

      // ユーザーが入力した文字と比較
      if (index < userInput.length) {
        if (char === userInput[index]) {
          color = "green"; // 正解は緑色
        } else {
          color = "red"; // 不正解は赤色
        }
      }

      return (
        <span
          key={index}
          style={{ color, fontWeight: "bold", margin: "0 2px" }}
        >
          {index < userInput.length ? userInput[index] : char}{" "}
          {/* 入力した文字を表示 */}
        </span>
      );
    });
  };

  // ゲーム開始時に最初の単語をセットし、タイマーを開始
  useEffect(() => {
    setRandomWord();

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // タイマーを停止
          alert("Finish!");
          router.push("/Result"); // 結果ページに遷移
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // クリーンアップ用
  }, []);

  // キー入力処理
  const handleKeyPress = (e: KeyboardEvent) => {
    if (timer > 0 && e.key.length === 1) {
      // タイマーが動いていて、1文字のキーが押された場合
      const newUserInput = userInput + e.key;

      // 入力が正しい場合のみ、ユーザー入力を更新
      if (newUserInput.length <= word.length) {
        setUserInput(newUserInput);
      } else {
      }

      // 単語が完全に入力された場合、スコアを増やして新しい単語を設定
      if (newUserInput === word) {
        setScore((prevScore) => prevScore + 1);
        setRandomWord();
      }
    }
  };

  // キー入力イベントを登録
  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [userInput, timer]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Typing Game</h1>
      <h2>Time: {timer} seconds</h2>
      <h2>Score: {score}</h2>
      <h2>
        <div>{renderWord()}</div>
      </h2>
    </div>
  );
};

export default TypingGame;

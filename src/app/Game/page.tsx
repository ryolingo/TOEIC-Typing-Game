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
  const [userInput, setUserInput] = useState(""); // 修正：useInput -> userInput
  const [score, setScore] = useState(0); // スコア管理
  const [timer, setTimer] = useState(60); // タイマーを60秒に設定
  const level = searchParams.get("level") || "easy";
  const [incorrectWords, setIncorrectWords] = useState<
    { word: string; meaning: string }[]
  >([]);
  const [gameOver, setgameOver] = useState(false);
  const router = useRouter();
  // フォーカス管理用のref
  const inputRef = useRef<HTMLInputElement>(null);

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
  };

  //間違えた単語の関数
  const saveIncorrectWord = async (
    word: string,
    meaning: string,
    score: number,
    gameId: string
  ) => {
    try {
      const docRef = await addDoc(collection(db, "incorrectWords"), {
        word,
        meaning,
        score, // スコアも追加して保存
        timestamp: new Date(),
        gameId,
      });
      console.log("Document written with ID: ", gameId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInput(value);
    if (value.length === word.length) {
      if (value === word) {
        // 正解の場合、スコアを加算し、新しい単語をセット
        setScore((prevScore) => prevScore + 1);
      } else {
        // 不正解の場合、Firestoreに追加
        saveIncorrectWord(word, meaning, score, gameId);
        setIncorrectWords((prev) => [...prev, { word, meaning }]);
      }

      // 次の単語をセットし、ユーザー入力をリセット
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
          setgameOver(true);
          alert("Finish!");
          router.push(
            `/Result?score=${scoreRef.current}&gameId=${gameId}&level=${level}`
          ); // 結果ページに遷移
        }
        return prev - 1;
      });
    }, 100); // タイマーを1秒に設定

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

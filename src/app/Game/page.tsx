"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { wordsList } from "../conponents/WordList";
import { addDoc, collection, doc, setDoc } from "firebase/firestore"; // 修正: setDocをインポート
import { db, auth } from "@/firebase/firebase"; // authを追加してFirebase Authenticationをインポート
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";

const TypingGame = () => {
  const [gameId] = useState(uuidv4());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState("");
  const searchParams = useSearchParams();
  const [meaning, setMeaning] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [mistyped, setMistyped] = useState(false);
  const [gameOver, setgameOver] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const level = searchParams.get("level") || "easy";

  // Firebase Authenticationでログイン状態を監視してuserIdを設定
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // ログインしている場合にuserIdを設定
      } else {
        router.push("/login"); // 未ログイン時はログインページにリダイレクト
      }
      setLoading(false); // ローディングを終了
    });
    return () => unsubscribe();
  }, [router]);

  const saveGameData = async (finalScore: number) => {
    if (!userId) return;
    try {
      const gameRef = doc(db, "GameData", gameId);
      await setDoc(gameRef, {
        userId,
        gameId,
        score: finalScore,
        level,
        timestamp: new Date(),
      });
      console.log("Game metadata saved successfully with gameId: ", gameId);
      console.log(userId);
    } catch (e) {
      console.error("Error adding game data: ", e);
      console.log(userId);
    }
  };
  const saveIncorrectWord = async (
    word: string,
    meaning: string,
    score: number
  ) => {
    if (!userId) return;
    try {
      const gameRef = doc(db, "GameData", gameId);
      const incorrectWordsRef = collection(gameRef, "incorrectWords");
      await addDoc(incorrectWordsRef, {
        word,
        meaning,
        score,
        timestamp: new Date(),
        userId,
      });
      console.log("Incorrect word saved successfully for gameId: ", gameId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const setRandomWord = () => {
    const levelWords =
      wordsList[level as keyof typeof wordsList] || wordsList.easy;
    const randomIndex = Math.floor(Math.random() * levelWords.length);
    const randomWord = levelWords[randomIndex];
    setWord(randomWord.word);
    setMeaning(randomWord.meaning);
    setUserInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInput(value);

    if (!mistyped && value !== word.slice(0, value.length)) {
      setMistyped(true);
      saveIncorrectWord(word, meaning, score); // 間違えた単語を保存
      console.log("Incorrect word saved: ", word);
      setMistyped(false); // 新しい単語を設定するたびにmistypedフラグをリセット
    }

    if (value === word) {
      setScore((prevScore) => prevScore + 1);
      setRandomWord();
      setUserInput("");
    }
  };

  const scoreRef = useRef(score);

  useEffect(() => {
    setRandomWord();

    if (inputRef.current) {
      inputRef.current.focus();
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setgameOver(true);
          saveGameData(scoreRef.current); // タイマー終了時に最終スコアを保存

          alert("Finish!");
          router.push(
            `/Result?score=${scoreRef.current}&gameId=${gameId}&level=${level}`
          );
        }
        return prev - 1;
      });
    }, 100); // 1秒ごとにタイマーを減少

    return () => clearInterval(interval);
  }, [userId]);

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
        <div>
          {word.split("").map((char, index) => {
            let color = "black";
            if (index < userInput.length) {
              color = char === userInput[index] ? "green" : "red";
            }
            return (
              <span key={index} style={{ color }}>
                {char}
              </span>
            );
          })}
        </div>
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

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getDocs,
  collection,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import {
  Card,
  CardHeader,
  CardContent,
  Alert,
  AlertTitle,
  Button,
  Input,
} from "@mui/material";

interface MissedWord {
  word: string;
  meaning: string;
}

export default function ReGame() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const level = searchParams.get("level");
  const score = searchParams.get("score");
  const router = useRouter();

  const [word, setWord] = useState<string>("");
  const [meaning, setMeaning] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [missedWords, setMissedWords] = useState<MissedWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const fetchIncorrectWords = async () => {
      try {
        if (gameId) {
          const q = query(
            collection(db, "incorrectWords"),
            where("gameId", "==", gameId)
          );
          const querySnapshot = await getDocs(q);
          const words = querySnapshot.docs.map(
            (doc: DocumentData) =>
              ({
                word: doc.data().word,
                meaning: doc.data().meaning,
              } as MissedWord)
          );
          setMissedWords(words);
        }
      } catch (error) {
        console.error("Error fetching missed words: ", error);
      }
    };

    fetchIncorrectWords();
  }, [gameId]);

  useEffect(() => {
    if (missedWords.length > 0) {
      setMissedWord();
    }
  }, [missedWords]);

  const setMissedWord = () => {
    if (currentWordIndex < missedWords.length) {
      const currentWord = missedWords[currentWordIndex];
      setWord(currentWord.word);
      setMeaning(currentWord.meaning);
      setUserInput("");
    } else {
      setShowAlert(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInput(value);

    if (value === word) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setMissedWord();
    }
  };

  const handleFinish = () => {
    router.push(`/Result?score=${score}&gameId=${gameId}&level=${level}`);
  };

  const renderWord = () => {
    return word.split("").map((char, index) => {
      let color = "text-gray-400";
      if (index < userInput.length) {
        color = char === userInput[index] ? "text-green-500" : "text-red-500";
      }
      return (
        <span key={index} className={`text-2xl font-mono ${color}`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader></CardHeader>
        <CardContent>
          {showAlert ? (
            <Alert className="mb-4">
              <AlertTitle>Great job!</AlertTitle>

              <Button onClick={handleFinish} className="mt-2">
                Go to Results
              </Button>
            </Alert>
          ) : (
            <>
              <div className="mb-4 text-center">{renderWord()}</div>
              <div className="mb-4 text-center text-gray-600">{meaning}</div>
              <Input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="text-lg p-2 w-full"
                placeholder="Type the word here..."
              />
              <div className="mt-4 text-center text-sm text-gray-500">
                Word {currentWordIndex + 1} of {missedWords.length}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

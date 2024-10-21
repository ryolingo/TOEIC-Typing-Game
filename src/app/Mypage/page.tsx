"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { db } from "@/firebase/firebase"; // Firebaseの初期化ファイルをインポート
import { collection, getDocs, query } from "firebase/firestore";

export default function IncorrectWordsPage() {
  const [incorrectWords, setIncorrectWords] = useState<
    {
      id: string;
      word: string;
      meaning: string;
      score: number;
      timeStamp: any;
      level: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true); // データ取得中のローディング状態

  // FirestoreからincorrectWordsを取得
  useEffect(() => {
    const fetchIncorrectWords = async () => {
      try {
        const q = query(collection(db, "GameData")); // incorrectWords コレクションをクエリ
        const querySnapshot = await getDocs(q);
        const words = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          word: doc.data().word,
          meaning: doc.data().meaning,
          score: doc.data().score, // スコアを取得
          timeStamp: doc.data().timeStamp, // タイムスタンプを取得
          level: doc.data().level, // レベルを取得
        }));
        setIncorrectWords(words);
      } catch (error) {
        console.error("Error fetching incorrect words: ", error);
      } finally {
        setLoading(false); // データ取得が完了したらローディング状態を終了
      }
    };

    fetchIncorrectWords();
  }, []); // 初回レンダリング時に実行

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {incorrectWords.length === 0 ? (
        <Typography variant="h5" component="p">
          No incorrect words found.
        </Typography>
      ) : (
        incorrectWords.map((word) => (
          <Card key={word.id} className="w-full max-w-md mb-4">
            <CardContent>
              <Typography variant="body1" component="p">
                Score: {word.score}
              </Typography>
              <Typography variant="body1" component="p">
                Level: {word.level}
              </Typography>
              <Typography variant="body1" component="p">
                Time: {word.timeStamp?.toDate().toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

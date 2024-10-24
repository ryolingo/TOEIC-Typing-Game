"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { auth, db } from "@/firebase/firebase"; // Firebase初期化ファイルをインポート
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import { useRouter } from "next/navigation"; // Next.js Router

export default function GameListPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [gameDataList, setGameDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Firebase Authでログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // ユーザーIDを設定
      } else {
        router.push("/login"); // 未ログインの場合はログインページにリダイレクト
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Firebaseからユーザーのゲームデータを取得
  useEffect(() => {
    const fetchGameDataList = async () => {
      if (!userId) return; // userIdがなければ何もしない

      // Firebase FirestoreからuserIdに対応するすべてのゲームデータを取得
      const gameDataQuery = query(
        collection(db, "GameData"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc") // 最新順に並び替え
      );

      const gameDataSnapshot = await getDocs(gameDataQuery);
      const games = gameDataSnapshot.docs.map((doc) => doc.data());
      setGameDataList(games);
      setLoading(false);
    };

    if (userId) {
      fetchGameDataList(); // userIdが取得されたらゲームデータを取得
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Typography variant="h4" component="h1" className="mb-6">
        Your Game History
      </Typography>

      {gameDataList.length === 0 ? (
        <Typography>No games played yet.</Typography>
      ) : (
        gameDataList.map((gameData, index) => (
          <Card key={index} className="w-full max-w-md mb-4">
            <CardContent>
              <Typography variant="body1">Level: {gameData.level}</Typography>
              <Typography variant="body1">Score: {gameData.score}</Typography>
              <Typography variant="body1">
                Timestamp:{" "}
                {new Date(gameData.timestamp.toDate()).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

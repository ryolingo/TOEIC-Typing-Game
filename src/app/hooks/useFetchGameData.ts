import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const useFetchGameData = (gameId: string) => {
  const [incorrectWords, setIncorrectWords] = useState<
    { word: string; meaning: string }[]
  >([]);
  const [gameData, setGameData] = useState<{
    score: number;
    level: string;
    timestamp: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 間違えた単語を取得
        const incorrectWordsQuery = query(
          collection(db, "incorrectWords"),
          where("gameId", "==", gameId)
        );
        const incorrectWordsSnapshot = await getDocs(incorrectWordsQuery);
        const incorrectWordsData = incorrectWordsSnapshot.docs.map((doc) => ({
          word: doc.data().word,
          meaning: doc.data().meaning,
        }));

        setIncorrectWords(incorrectWordsData);

        // ゲームデータを取得
        const gameDataQuery = query(
          collection(db, "GameData"),
          where("gameId", "==", gameId)
        );
        const gameDataSnapshot = await getDocs(gameDataQuery);
        const gameDataItem = gameDataSnapshot.docs[0]?.data(); // 一つのデータのみを想定
        setGameData({
          score: gameDataItem?.score,
          level: gameDataItem?.level,
          timestamp: gameDataItem?.timestamp,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching game data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  return { incorrectWords, gameData, loading };
};

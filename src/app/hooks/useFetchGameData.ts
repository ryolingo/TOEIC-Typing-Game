import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
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
        // gameId に一致する GameData ドキュメントを取得
        const gameDataQuery = query(
          collection(db, "GameData"),
          where("gameId", "==", gameId)
        );
        const querySnapshot = await getDocs(gameDataQuery);

        querySnapshot.forEach((doc) => {
          const gameDataItem = doc.data();
          setGameData({
            score: gameDataItem?.score,
            level: gameDataItem?.level,
            timestamp: gameDataItem?.timestamp,
          });
        });

        // IncorrectWords サブコレクションを取得
        const incorrectWordsRef = collection(
          db,
          "GameData",
          gameId,
          "incorrectWords"
        );
        console.log(incorrectWordsRef);
        const incorrectWordsSnapshot = await getDocs(incorrectWordsRef);
        const incorrectWordsData = incorrectWordsSnapshot.docs.map((doc) => ({
          word: doc.data().word,
          meaning: doc.data().meaning,
        }));
        console.log(incorrectWordsData);

        setIncorrectWords(incorrectWordsData);
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

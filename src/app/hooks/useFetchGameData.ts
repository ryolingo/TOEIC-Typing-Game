import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
        // GameData ドキュメントを取得
        const gameDocRef = doc(db, "GameData", gameId); // gameId で GameData を取得
        const gameDocSnap = await getDoc(gameDocRef);

        if (gameDocSnap.exists()) {
          const gameDataItem = gameDocSnap.data();
          setGameData({
            score: gameDataItem?.score,
            level: gameDataItem?.level,
            timestamp: gameDataItem?.timestamp,
          });

          // IncorrectWords サブコレクションを取得
          const incorrectWordsRef = collection(gameDocRef, "IncorrectWords");
          const incorrectWordsSnapshot = await getDocs(incorrectWordsRef);
          const incorrectWordsData = incorrectWordsSnapshot.docs.map((doc) => ({
            word: doc.data().word,
            meaning: doc.data().meaning,
          }));

          setIncorrectWords(incorrectWordsData);
        } else {
          console.error("No such game document!");
        }

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

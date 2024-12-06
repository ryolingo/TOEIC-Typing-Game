import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Firebase初期化ファイル
import { timeStamp } from "console";

export const useFetchUserData = (userId: string) => {
  const [gameDataList, setGameDataList] = useState<any[]>([]); // ゲームデータリストを保持
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FirestoreのGameDataコレクションからuserIdに基づいてすべてのゲームデータを取得
        const gameDataQuery = query(
          collection(db, "GameData"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(gameDataQuery);
        console.log("GameData Query Snapshot:", querySnapshot.docs);

        const allGameData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            console.log("GameData Doc:", doc.data());
            const gameData = doc.data();

            console.log(gameData);
            // 各ゲームのincorrectWordsサブコレクションを取得
            const incorrectWordsSnapshot = await getDocs(
              collection(db, "GameData", doc.id, "incorrectWords")
            );
            const incorrectWords = incorrectWordsSnapshot.docs.map(
              (wordDoc) => ({
                word: wordDoc.data().word,
                meaning: wordDoc.data().meaning,
              })
            );

            return {
              ...gameData,
              incorrectWords,
            };
          })
        );

        setGameDataList(allGameData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return { gameDataList, loading };
};

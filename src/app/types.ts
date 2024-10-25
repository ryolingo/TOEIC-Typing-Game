// types.ts

// IncorrectWord 型の定義
export type IncorrectWord = {
  word: string;
  meaning: string;
};

// GameData 型の定義
export type GameData = {
  score: number;
  level: string;
  timestamp: any;
  incorrectWords: IncorrectWord[];
};

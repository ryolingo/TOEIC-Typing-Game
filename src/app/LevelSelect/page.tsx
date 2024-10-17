// app/LevelSelect/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Typography } from "@mui/material";

export default function LevelSelect() {
  const router = useRouter();

  const handleLevelSelect = (level: string) => {
    router.push(`/Game?level=${level}`); // 選択したレベルをURLに含めて次の画面に遷移
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Typography variant="h3" className="mb-6">
        Select Level
      </Typography>
      <div className="flex space-x-4">
        <Card
          onClick={() => handleLevelSelect("easy")}
          className="cursor-pointer"
        >
          <CardContent>
            <Typography variant="h5">Easy</Typography>
            <Typography>Perfect for beginners</Typography>
          </CardContent>
        </Card>
        <Card
          onClick={() => handleLevelSelect("medium")}
          className="cursor-pointer"
        >
          <CardContent>
            <Typography variant="h5">Medium</Typography>
            <Typography>For intermediate typers</Typography>
          </CardContent>
        </Card>
        <Card
          onClick={() => handleLevelSelect("hard")}
          className="cursor-pointer"
        >
          <CardContent>
            <Typography variant="h5">Hard</Typography>
            <Typography>Challenge yourself</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

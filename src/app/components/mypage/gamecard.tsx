"use client";

import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GameData } from "@/app/types";

type GameCardProps = {
  gameData: GameData;
};

const GameCard: React.FC<GameCardProps> = ({ gameData }) => {
  return (
    <Card sx={{ mb: 3, overflow: "hidden" }}>
      <CardHeader
        title={`Game`}
        subheader={new Date(gameData.timestamp.toDate()).toLocaleString()}
      />
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Chip
            label={`Score: ${gameData.score}`}
            color="primary"
            sx={{ fontWeight: "bold" }}
          />
          <Chip
            label={`Level: ${gameData.level}`}
            color="secondary"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        {gameData.incorrectWords && gameData.incorrectWords.length > 0 && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${gameData.gameId}-content`}
              id={`panel${gameData.gameId}-header`}
            >
              <Typography
                sx={{
                  fontWeight: "medium",
                  color: "text.secondary",
                }}
              >
                間違えた単語 ({gameData.incorrectWords.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {gameData.incorrectWords.map((word, wordIndex) => (
                  <Box
                    component="li"
                    key={wordIndex}
                    sx={{
                      py: 1,
                      borderBottom:
                        wordIndex < gameData.incorrectWords.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "medium",
                        color: "text.primary",
                      }}
                    >
                      {word.word}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {word.meaning}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;

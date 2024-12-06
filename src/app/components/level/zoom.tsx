"use client";

import React from "react";
import { Button, Card, CardContent, Typography, Zoom } from "@mui/material";
import { styled } from "@mui/system";

// スタイル付きコンポーネント
const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2)",
  },
}));

const LevelButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 600,
}));

type CardsProps = {
  name: string;
  description: string;
  color: string;
  onClick: () => void;
};

const Cards: React.FC<CardsProps> = ({ name, description, color, onClick }) => {
  return (
    <Zoom in={true} style={{ transitionDelay: `${1 * 1}ms` }}>
      <StyledCard>
        <CardContent sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, color: color }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <LevelButton
            variant="contained"
            color="primary"
            onClick={onClick}
            fullWidth
          >
            Start
          </LevelButton>
        </CardContent>
      </StyledCard>
    </Zoom>
  );
};

export default Cards;

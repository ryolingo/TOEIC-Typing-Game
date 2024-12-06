import { Grow, Typography } from "@mui/material";
import React from "react";

const LevelHeader = () => {
  return (
    <Grow in={true} timeout={1000}>
      <Typography variant="h3" sx={{ mb: 6, textAlign: "center" }}>
        Select Your Challenge
      </Typography>
    </Grow>
  );
};

export default LevelHeader;

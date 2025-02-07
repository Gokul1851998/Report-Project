import React from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import { MDBIcon } from "mdb-react-ui-kit";

function ActionButton({ iconsClick, icon, caption}) {
  const iconsExtraSx = {
    fontSize: "1rem",
    padding: "0.5rem",
    "&:hover": {
      backgroundColor: "transparent",
    },
  };
  const styleIcon = {
  
  };

  const styleText = {
    fontSize: "0.6rem",
    "@media (max-width: 600px)": {
      fontSize: "0.5rem", // Reduce font size on smaller screens
    },
  };

  return (
    <IconButton
      aria-label="New"
      sx={iconsExtraSx}
      onClick={iconsClick}
    >
      <Stack direction="column" alignItems="center">
        <MDBIcon
          fas
          icon={icon}
          style={styleIcon}
          className="responsiveAction-icon"
        />
        <Typography variant="caption" align="center" sx={styleText}>
          {caption}
        </Typography>
      </Stack>
    </IconButton>
  );
}

export default ActionButton;

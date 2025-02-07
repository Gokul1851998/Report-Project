import { TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/system";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    "& textarea": {
      "&::-webkit-scrollbar": {
        width: "6px", // Adjust the width as needed
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.2)", // Adjust the color as needed
        borderRadius: "3px", // Adjust the border radius as needed
        cursor: "pointer",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)", // Adjust the track color as needed
      },
    },
  },
}));

export default function TextBox({
  name,
  label,
  type,
  disabled,
  value,
  setValue,
  width,
  multiline,
  mandatory,
  handleMouseLeave,
}) {
  const theme = useTheme();
  const [tabPressed, setTabPressed] = useState(false);

  const handleChange = (event) => {
    const update = { ...value };
    update[name] = event.target.value;
    setValue(update);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      setTabPressed(true);  // Set flag if Tab key is pressed
    }
  };

  const handleBlur = (event) => {
    if (tabPressed) {
      setTabPressed(false);  // Reset flag after handling
      if (typeof handleMouseLeave === 'function') {
        handleMouseLeave();
      }
    }
  };

  return (
    <CustomTextField
      margin="normal"
      size="small"
      id="search1"
      value={value[name] || ""}
      type={type}
      label={label}
      required={mandatory}
      multiline={multiline}
      rows={multiline ? 3 : null}
      autoComplete="off"
      disabled={disabled}
      onChange={handleChange}
      onMouseLeave={value[name]? handleMouseLeave : null} // Trigger on mouse leave
      onBlur={handleBlur} // Trigger only if Tab key was pressed
      onKeyDown={handleKeyDown} // Detect if Tab is pressed
      InputProps={{
        inputProps: {
          autoComplete: `off`,
          ...(type === "date" && {
            onClick: (e) => e.target.showPicker?.(),
          }),
        },
      }}
      sx={{
        width: width ? width : 250, // Adjust the width as needed
        "@media (max-width: 360px)": {
          width: 220, // Reduced width for small screens
        },
        "& .MuiInputBase-root": {
          ...(multiline ? {} : { height: 30 }), // Adjust the height of the input area if not multiline
          "& textarea": {
            "&::-webkit-scrollbar": {
              width: "6px", // Adjust the width as needed
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.2)", // Adjust the color as needed
              borderRadius: "3px", // Adjust the border radius as needed
              cursor: "pointer",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)", // Adjust the track color as needed
            },
          },
        },
        "& .MuiInputLabel-root": {
          fontSize: "14px",
          transform: "translate(10px, 5px) scale(0.9)", // Adjust label position when not focused
          color:"inherit",
        },
        "& .MuiInputLabel-shrink": {
          transform: "translate(14px, -9px) scale(0.75)", // Adjust label position when focused
        },
        "& .MuiInputBase-input": {
          fontSize: "0.75rem", // Adjust the font size of the input text
          color:"inherit",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Keeps the current border color
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "currentColor", // Optional: Keeps the border color on hover
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color:"inherit", // Ensure the label color when focused
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor:"#ddd",
          },
          "&:hover fieldset": {
            borderColor:"currentColor", // Keeps the border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor:"currentColor", // Keeps the current border color
          },
        },
      }}
    />
  );
}

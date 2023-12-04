import React from "react";

import { globalThemeColorVars, Typography } from "main";

import { colorStyles, colorTextStyles, wrapperStyles } from "./style.css";

export function ColorsDemo() {
  return (
    <div className={wrapperStyles}>
      {Object.keys(globalThemeColorVars).map((colorName) => (
        <div
          key={colorName}
          className={colorStyles}
          style={{ backgroundColor: globalThemeColorVars[colorName as keyof typeof globalThemeColorVars] }}
        >
          <Typography className={colorTextStyles}>{colorName}</Typography>
        </div>
      ))}
    </div>
  );
}

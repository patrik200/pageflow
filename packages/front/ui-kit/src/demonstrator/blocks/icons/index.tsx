import React from "react";

import { Icon, internalIcons, Typography } from "main";

import { iconStyles, iconWrapperStyles, textStyles, wrapperStyles } from "./style.css";

export function IconsDemo() {
  return (
    <div className={wrapperStyles}>
      {Object.keys(internalIcons).map((icon) => (
        <div key={icon} className={iconWrapperStyles}>
          <Icon className={iconStyles} icon={icon} />
          <Typography className={textStyles}>{icon}</Typography>
        </div>
      ))}
    </div>
  );
}

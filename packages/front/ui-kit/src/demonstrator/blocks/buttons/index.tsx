import React from "react";

import { Button } from "main";

import { buttonsWrapperStyles, buttonWithMaxWidthStyle, coloredButtonStyle, wrapperStyle } from "./style.css";

export function ButtonsDemo() {
  return (
    <div className={wrapperStyle}>
      <div className={buttonsWrapperStyles}>
        <Button type="PRIMARY">PRIMARY</Button>
        <Button type="OUTLINE">OUTLINE</Button>
        <Button type="WITHOUT_BORDER">WITHOUT_BORDER</Button>
      </div>
      <div className={buttonsWrapperStyles}>
        <Button size="EXTRA_SMALL" iconLeft="plusLine">
          EXTRA_SMALL
        </Button>
        <Button size="SMALL" iconLeft="plusLine">
          SMALL
        </Button>
        <Button size="MEDIUM" iconLeft="plusLine">
          MEDIUM
        </Button>
      </div>
      <div className={buttonsWrapperStyles}>
        <Button className={coloredButtonStyle}>COLORED</Button>
      </div>
      <div className={buttonsWrapperStyles}>
        <Button className={buttonWithMaxWidthStyle} dots>
          very long text 123123123123123
        </Button>
        <Button loading>button with loading</Button>
        <Button disabled>disabled</Button>
      </div>
    </div>
  );
}

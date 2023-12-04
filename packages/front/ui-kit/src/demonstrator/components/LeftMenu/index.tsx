import React from "react";
import cn from "classnames";

import { Button, Typography } from "main";

import { demoComponents } from "../../registrar";

import {
  headerStyle,
  headerTextStyle,
  headerToggleButtonOpenedStyles,
  headerToggleButtonStyle,
  mainItemActiveStyle,
  mainItemStyle,
  mainItemTextActiveStyle,
  mainItemTextStyle,
  mainStyle,
  wrapperStyle,
} from "./style.css";

interface menuInterface {
  opened: boolean;
  active: string;
  toggleOpened: () => void;
  setActive: (name: string) => void;
}

function menu({ opened, active, toggleOpened, setActive }: menuInterface) {
  return (
    <div className={wrapperStyle}>
      <div className={headerStyle}>
        <Button
          leftIconClassName={cn(opened && headerToggleButtonOpenedStyles)}
          className={headerToggleButtonStyle}
          type="OUTLINE"
          size="SMALL"
          iconLeft="arrowRightSLine"
          onClick={toggleOpened}
        />
        <Typography className={headerTextStyle}>Components</Typography>
      </div>
      <div style={opened ? { width: "290px" } : { width: "0px" }} className={mainStyle}>
        {demoComponents.map(({ name }) => (
          <div
            key={name}
            className={cn(mainItemStyle, name === active && mainItemActiveStyle)}
            onClick={() => setActive(name)}
          >
            <Typography className={cn(mainItemTextStyle, name === active && mainItemTextActiveStyle)}>
              {name}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(menu);

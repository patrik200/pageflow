import React from "react";

import { Switch, Typography } from "main";

import { switchesWrapperStyles, textStyles, wrapperStyle } from "./style.css";

export function SwitchDemo() {
  const [value, setValue] = React.useState(true);
  const [value2, setValue2] = React.useState(false);

  return (
    <div className={wrapperStyle}>
      <div className={switchesWrapperStyles}>
        <Typography className={textStyles}>Active pressed</Typography>
        <Switch value={value} onChange={(v: boolean) => setValue(v)}>
          some text
        </Switch>
      </div>
      <div className={switchesWrapperStyles}>
        <Typography className={textStyles}>Active not pressed</Typography>
        <Switch value={value2} onChange={(v: boolean) => setValue2(v)} />
      </div>
      <div className={switchesWrapperStyles}>
        <Typography className={textStyles}>Disabled</Typography>
        <Switch value={false} onChange={console.log} disabled />
        <Switch value={true} onChange={console.log} disabled />
      </div>
    </div>
  );
}

import React from "react";

import { Tabs, Typography } from "main";

import { textStyles, wrapperStyles } from "./style.css";

const tabs = [
  { code: "one", title: "ONE", element: <Typography className={textStyles}>One</Typography> },
  { code: "two", title: "TWO", element: <Typography className={textStyles}>two</Typography> },
  {
    code: "three",
    title: "THREE with very long title",
    element: <Typography className={textStyles}>three</Typography>,
  },
];

export function TabsDemo() {
  const [tab, setTab] = React.useState("one");
  return (
    <div className={wrapperStyles}>
      <Tabs active={tab} items={tabs} onChange={setTab} />
      <Tabs active={tab} fitTabButtonsByContent={false} items={tabs} onChange={setTab} />
    </div>
  );
}

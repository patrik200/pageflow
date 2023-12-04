import React from "react";
import { range } from "@worksolutions/utils";
import { useToggle } from "@worksolutions/react-utils";

import { Button, Scroll, Typography } from "main";

import { contentStyles, subScrollStyles, wrapperStyles } from "./style.css";

export function ScrollDemo() {
  const [large, toggleLarge] = useToggle(true);

  return (
    <>
      <Button onClick={toggleLarge}>toggle elements</Button>
      <Scroll className={wrapperStyles}>
        <Scroll className={subScrollStyles}>
          {range(1, 20).map((i) => (
            <Typography key={i} className={contentStyles}>
              {i}
            </Typography>
          ))}
        </Scroll>
        {range(1, large ? 20 : 5).map((i) => (
          <Typography key={i} className={contentStyles}>
            {i}
          </Typography>
        ))}
      </Scroll>
    </>
  );
}

import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";

import { textStyles } from "./style.css";

interface NameAndImageRowImageFallbackInterface {
  name: string;
}

function NameAndImageRowImageFallback({ name }: NameAndImageRowImageFallbackInterface) {
  const [firstName = "", lastName = ""] = name.split(" ");
  const firstLetter = firstName[0] || "";
  const secondLetter = lastName[0] || "";

  return (
    <Typography className={textStyles}>
      {firstLetter.toUpperCase()}
      {secondLetter.toUpperCase()}
    </Typography>
  );
}

export default observer(NameAndImageRowImageFallback);

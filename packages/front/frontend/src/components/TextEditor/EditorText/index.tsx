import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";

import { textStyles } from "./style.css";

interface EditorTextInterface {
  text: string;
}

function EditorText({ text }: EditorTextInterface) {
  return (
    <Typography className={textStyles} asHTML>
      {text}
    </Typography>
  );
}

export default observer(EditorText);

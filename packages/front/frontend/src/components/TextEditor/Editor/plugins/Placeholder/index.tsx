import React from "react";
import { Typography } from "@app/ui-kit";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { placeholderStyles } from "./style.css";

interface PlaceholderPluginInterface {
  placeholder?: string;
}

function PlaceholderPlugin({ placeholder }: PlaceholderPluginInterface) {
  const [editor] = useLexicalComposerContext();
  const handleClick = React.useCallback(() => editor.focus(), [editor]);

  if (!placeholder) return null;
  return (
    <Typography className={placeholderStyles} onClick={handleClick}>
      {placeholder}
    </Typography>
  );
}

export default React.memo(PlaceholderPlugin);

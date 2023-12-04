import React, { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";

import SimpleButton from "../../Elements/Button";
import { useCommandReaction } from "../../../useCommandReaction";
import { getSelection } from "../utils/getSelection";

function ToolbarBold() {
  const [editor] = useLexicalComposerContext();
  const [enabled, setEnabled] = useState(false);

  useCommandReaction(
    SELECTION_CHANGE_COMMAND,
    React.useCallback(() => {
      const selection = getSelection();
      if (selection) setEnabled(selection.hasFormat("bold"));
    }, []),
  );

  const handleClick = React.useCallback(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"), [editor]);

  return <SimpleButton enabled={enabled} icon="editorBold" onClick={handleClick} />;
}

export default React.memo(ToolbarBold);

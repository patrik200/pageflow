import React, { useState } from "react";
import { FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import SimpleButton from "../../Elements/Button";
import { useCommandReaction } from "../../../useCommandReaction";
import { getSelection } from "../utils/getSelection";

function ToolbarCodeView() {
  const [editor] = useLexicalComposerContext();
  const [enabled, setEnabled] = useState(false);

  useCommandReaction(
    SELECTION_CHANGE_COMMAND,
    React.useCallback(() => {
      const selection = getSelection();
      if (selection) setEnabled(selection.hasFormat("code"));
    }, []),
  );

  const handleClick = React.useCallback(() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code"), [editor]);

  return <SimpleButton enabled={enabled} icon="editorCodeView" onClick={handleClick} />;
}

export default React.memo(ToolbarCodeView);

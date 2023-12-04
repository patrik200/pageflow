import React, { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

import ToolbarLinkButton from "./Button";
import SimpleButton from "../../Elements/Button";

function ToolbarLink() {
  const [editor] = useLexicalComposerContext();
  const [available, setAvailable] = useState(false);
  const handleUnlink = React.useCallback(() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null), [editor]);

  return (
    <>
      <ToolbarLinkButton onChangeAvailability={setAvailable} />
      <SimpleButton disabled={!available} icon="editorUnlink" onClick={handleUnlink} />
    </>
  );
}

export default React.memo(ToolbarLink);

import React from "react";
import { INSERT_UNORDERED_LIST_COMMAND, insertList, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import SimpleButton from "../../Elements/Button";
import { useCommandReaction } from "../../../useCommandReaction";
import { useListEnabled } from "../ListOrdered/useListEnabled";

function ToolbarListUnordered() {
  const [editor] = useLexicalComposerContext();

  useCommandReaction(
    INSERT_UNORDERED_LIST_COMMAND,
    React.useCallback(() => {
      insertList(editor, "bullet");
      return true;
    }, [editor]),
    { callOnUpdates: false },
  );

  const enabled = useListEnabled("bullet");

  const handleClick = React.useCallback(
    () => editor.dispatchCommand(enabled ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND, undefined),
    [editor, enabled],
  );

  return <SimpleButton enabled={enabled} icon="editorListUnordered" onClick={handleClick} />;
}

export default React.memo(ToolbarListUnordered);

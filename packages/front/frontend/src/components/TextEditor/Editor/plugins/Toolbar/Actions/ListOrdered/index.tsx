import React from "react";
import { INSERT_ORDERED_LIST_COMMAND, insertList, REMOVE_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import SimpleButton from "../../Elements/Button";
import { useCommandReaction } from "../../../useCommandReaction";
import { useListEnabled } from "./useListEnabled";

function ToolbarListOrdered() {
  const [editor] = useLexicalComposerContext();

  useCommandReaction(
    INSERT_ORDERED_LIST_COMMAND,
    React.useCallback(() => {
      insertList(editor, "number");
      return true;
    }, [editor]),
    { callOnUpdates: false },
  );

  const enabled = useListEnabled("number");

  const handleClick = React.useCallback(
    () => editor.dispatchCommand(enabled ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND, undefined),
    [editor, enabled],
  );

  return <SimpleButton enabled={enabled} icon="editorListOrdered" onClick={handleClick} />;
}

export default React.memo(ToolbarListOrdered);

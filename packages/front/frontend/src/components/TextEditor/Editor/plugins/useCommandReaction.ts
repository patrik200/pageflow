import React from "react";
import { LexicalCommand, COMMAND_PRIORITY_LOW } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { isArray } from "@worksolutions/utils";

export function useCommandReaction(
  commands: LexicalCommand<void> | LexicalCommand<void>[],
  callback: () => void | boolean,
  { callOnUpdates = true }: { callOnUpdates?: boolean } = {},
) {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    const commandsArray = isArray(commands) ? commands : [commands];
    return mergeRegister(
      ...(callOnUpdates ? [editor.registerUpdateListener(({ editorState }) => editorState.read(callback))] : []),
      ...commandsArray.map((command) =>
        editor.registerCommand(command, () => callback() ?? false, COMMAND_PRIORITY_LOW),
      ),
    );
  }, [callOnUpdates, callback, commands, editor]);
}

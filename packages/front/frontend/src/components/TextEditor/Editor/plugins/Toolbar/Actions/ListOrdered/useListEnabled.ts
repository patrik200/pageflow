import React, { useState } from "react";
import { $isRootOrShadowRoot, SELECTION_CHANGE_COMMAND } from "lexical";
import { $isListNode, ListType } from "@lexical/list";
import { RangeSelection } from "lexical/LexicalSelection";
import { $findMatchingParent } from "@lexical/utils";

import { useCommandReaction } from "../../../useCommandReaction";
import { getSelection } from "../utils/getSelection";

export function useListEnabled(expectedListType: ListType) {
  const [enabled, setEnabled] = useState(false);

  useCommandReaction(
    SELECTION_CHANGE_COMMAND,
    React.useCallback(() => {
      const selection = getSelection();
      if (!selection) {
        setEnabled(false);
        return;
      }

      const node = getSelectionNode(selection);

      if ($isListNode(node)) {
        setEnabled(node.getListType() === expectedListType);
      } else {
        setEnabled(false);
      }
    }, [expectedListType]),
  );

  return enabled;
}

function getSelectionNode(selection: RangeSelection) {
  const anchorNode = selection.anchor.getNode();
  let element =
    anchorNode.getKey() === "root"
      ? anchorNode
      : $findMatchingParent(anchorNode, (node) => {
          const parent = node.getParent();
          return parent !== null && $isRootOrShadowRoot(parent);
        });

  if (element === null) element = anchorNode.getTopLevelElementOrThrow();

  return element;
}

import React from "react";
import { SELECTION_CHANGE_COMMAND, $createParagraphNode } from "lexical";
import { SelectFieldOption } from "@app/ui-kit";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, HeadingTagType, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { useTranslation } from "@app/front-kit";

import ToolbarSelect from "./Select";
import { useCommandReaction } from "../../../useCommandReaction";
import { getSelection } from "../utils/getSelection";
import { getSelectionNode } from "../utils/getSelectionNode";

type TagType = HeadingTagType | "paragraph";

function ToolbarTextType() {
  const { t } = useTranslation();

  const [editor] = useLexicalComposerContext();
  const [tagType, setTagType] = React.useState<TagType>("paragraph");

  useCommandReaction(
    SELECTION_CHANGE_COMMAND,
    React.useCallback(() => {
      const selection = getSelection();
      if (!selection) {
        setTagType("paragraph");
        return;
      }
      const node = getSelectionNode(selection).getParent();
      if (!node || !$isHeadingNode(node)) {
        setTagType("paragraph");
        return;
      }
      setTagType(node.getTag());
    }, []),
  );

  const selectFieldOptions = React.useMemo<SelectFieldOption<TagType>[]>(
    () => [
      { label: t({ scope: "text_editor", place: "toolbar_text_type", name: "paragraph" }), value: "paragraph" },
      { label: t({ scope: "text_editor", place: "toolbar_text_type", name: "h1" }), value: "h1" },
      { label: t({ scope: "text_editor", place: "toolbar_text_type", name: "h2" }), value: "h2" },
      { label: t({ scope: "text_editor", place: "toolbar_text_type", name: "h3" }), value: "h3" },
      { label: t({ scope: "text_editor", place: "toolbar_text_type", name: "h4" }), value: "h4" },
    ],
    [t],
  );

  const handleChange = React.useCallback(
    (value: TagType) => {
      editor.update(() => {
        const selection = getSelection();
        if (!selection) return;
        $setBlocksType(selection, () => (value === "paragraph" ? $createParagraphNode() : $createHeadingNode(value)));
      });
    },
    [editor],
  );

  return <ToolbarSelect value={tagType} options={selectFieldOptions} onChange={handleChange} />;
}

export default React.memo(ToolbarTextType);

import React from "react";
import { Button, Form, PopupComponent, TextField, VisibilityManagerContext } from "@app/ui-kit";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, useTranslation } from "@app/front-kit";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { SELECTION_CHANGE_COMMAND } from "lexical";
import { RangeSelection } from "lexical/LexicalSelection";

import { EditUrlEntity } from "./entity";
import { useCommandReaction } from "../../../../../useCommandReaction";
import { getSelection } from "../../../utils/getSelection";
import { getSelectionNode } from "../../../utils/getSelectionNode";

import { popupStyles, textFieldStyles } from "./style.css";

function ToolbarLinkPopup() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();

  const entity = React.useMemo(() => EditUrlEntity.buildEmpty(), []);

  const { hide } = React.useContext(VisibilityManagerContext);

  const handleClick = React.useCallback(
    () =>
      entity.submit({
        onSuccess: () => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: entity.url, target: "_blank" });
          hide();
        },
      }),
    [editor, entity, hide],
  );

  useCommandReaction(
    SELECTION_CHANGE_COMMAND,
    React.useCallback(() => {
      const selection = getSelection();
      if (!selection) return;
      entity.setUrl(getLinkNode(selection)?.getURL() ?? "");
    }, [entity]),
  );

  return (
    <Form onSubmit={handleClick}>
      <PopupComponent>
        <div className={popupStyles}>
          <TextField
            className={textFieldStyles}
            autoFocus
            value={entity.url}
            placeholder={t({
              scope: "text_editor",
              place: "toolbar_link",
              name: "url_field",
              parameter: "placeholder",
            })}
            materialPlaceholder={false}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.url, t)}
            onChangeInput={entity.setUrl}
          />
          <Button size="SMALL" onClick={handleClick}>
            {t({ scope: "text_editor", place: "toolbar_link", name: "save_button" })}
          </Button>
        </div>
      </PopupComponent>
    </Form>
  );
}

export default observer(ToolbarLinkPopup);

export function getLinkNode(selection: RangeSelection) {
  const node = getSelectionNode(selection);
  const parent = node.getParent();
  if ($isLinkNode(parent)) {
    return parent;
  } else if ($isLinkNode(node)) {
    return node;
  } else {
    return null;
  }
}

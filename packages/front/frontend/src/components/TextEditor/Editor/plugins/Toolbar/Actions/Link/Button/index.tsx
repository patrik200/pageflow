import React, { useState } from "react";
import { PopupManager, PopupManagerMode } from "@app/ui-kit";
import { $isTextNode, SELECTION_CHANGE_COMMAND } from "lexical";

import SimpleButton from "../../../Elements/Button";
import { useCommandReaction } from "../../../../useCommandReaction";
import { getSelection } from "../../utils/getSelection";
import { getSelectionNode } from "../../utils/getSelectionNode";
import ToolbarLinkPopup, { getLinkNode } from "./Popup";

interface ToolbarLinkButtonInterface {
  onChangeAvailability: (available: boolean) => void;
}

function ToolbarLinkButton({ onChangeAvailability }: ToolbarLinkButtonInterface) {
  const [enabled, setEnabled] = useState(false);
  const [disabled, setDisabled] = useState(true);
  React.useEffect(() => onChangeAvailability(enabled && !disabled), [disabled, enabled, onChangeAvailability]);

  useCommandReaction(
    SELECTION_CHANGE_COMMAND,
    React.useCallback(() => {
      const selection = getSelection();
      if (!selection) return;
      setDisabled(!$isTextNode(getSelectionNode(selection)));
      setEnabled(!!getLinkNode(selection));
    }, []),
  );

  return (
    <PopupManager
      mode={PopupManagerMode.CLICK}
      triggerElement={<SimpleButton disabled={disabled} enabled={enabled} icon="editorLink" />}
      popupElement={<ToolbarLinkPopup />}
    />
  );
}

export default React.memo(ToolbarLinkButton);

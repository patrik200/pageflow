import React from "react";

import { Button, CopyToClipboard } from "main";

import DemoGroup from "../../components/DemoGroup";

import { wrapperStyles } from "./style.css";

export function CopyToClipboardDemo() {
  return (
    <DemoGroup title="Copy to clipboard">
      <div className={wrapperStyles}>
        <CopyToClipboard
          value="Скопированное значение"
          tooltipCopiedText="Скопировано!"
          tooltipCopyText="Нажмите чтобы скопировать"
        >
          <Button size="SMALL">Скопировать</Button>
        </CopyToClipboard>
      </div>
    </DemoGroup>
  );
}

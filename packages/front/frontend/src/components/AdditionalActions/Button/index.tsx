import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";

import { buttonStyles } from "./style.css";

interface AdditionalActionButtonInterface {
  text: string;
  loading?: boolean;
  onClick: () => void;
}

function AdditionalActionButton({ text, loading, onClick }: AdditionalActionButtonInterface) {
  return (
    <Button className={buttonStyles} loading={loading} type="WITHOUT_BORDER" size="SMALL" onClick={onClick}>
      {text}
    </Button>
  );
}

export default observer(AdditionalActionButton);

import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { buttonStyles } from "./style.css";

interface AdditionalActionFavouriteInterface {
  favourite: boolean;
  onChange: (newFavourite: boolean) => Promise<any>;
}

function AdditionalActionFavourite({ favourite, onChange }: AdditionalActionFavouriteInterface) {
  const [{ loading }, asyncChange] = useAsyncFn(onChange, [onChange]);
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      void asyncChange(!favourite);
    },
    [asyncChange, favourite],
  );

  return (
    <Button
      className={buttonStyles}
      size="SMALL"
      type="WITHOUT_BORDER"
      iconLeft={favourite ? "starFill" : "starLine"}
      loading={loading}
      onClick={handleClick}
    />
  );
}

export default observer(AdditionalActionFavourite);

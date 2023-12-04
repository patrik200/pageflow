import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";

import { ClientCommonStorage } from "core/storages/client/client-common";

import ViewMode from "./Modes/ViewMode";
import EditMode from "./Modes/EditMode";
import LogoView from "./LogoView";

import { cardStyles, contentWrapperStyles } from "./style.css";

function SettingsClientView() {
  const [editMode, enableEditMode, disableEditMode] = useBoolean(false);
  const { loadCurrentClientStorage } = useViewContext().containerInstance.get(ClientCommonStorage);
  React.useEffect(() => void loadCurrentClientStorage(), [loadCurrentClientStorage]);

  return (
    <Card className={cardStyles}>
      <div className={contentWrapperStyles}>
        {editMode ? <EditMode disableEditMode={disableEditMode} /> : <ViewMode enableEditMode={enableEditMode} />}
      </div>
      {!editMode && <LogoView />}
    </Card>
  );
}

export default observer(SettingsClientView);

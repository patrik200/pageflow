import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import MainContent from "./Main";
import ResponsibleContent from "./Responsible";
import PermissionsContent from "./Permissions";

import {
  responsibleCardStyles,
  mainCardStyles,
  wrapperStyles,
  additionalCardsWrapperStyles,
  permissionsCardStyles,
} from "./style.css";

function DocumentInfoCard() {
  return (
    <div className={wrapperStyles}>
      <Card className={mainCardStyles}>
        <MainContent />
      </Card>
      <div className={additionalCardsWrapperStyles}>
        <Card className={responsibleCardStyles}>
          <ResponsibleContent />
        </Card>
        <Card className={permissionsCardStyles}>
          <PermissionsContent />
        </Card>
      </div>
    </div>
  );
}

export default observer(DocumentInfoCard);

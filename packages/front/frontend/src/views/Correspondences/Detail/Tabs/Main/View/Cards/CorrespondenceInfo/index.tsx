import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import MainForm from "./MainForm";
import AdditionalForm from "./AdditionalForm";

import { additionalInfoCardStyles, mainInfoCardStyles, wrapperStyles } from "./style.css";

function CorrespondenceInfoCard() {
  return (
    <div className={wrapperStyles}>
      <Card className={mainInfoCardStyles}>
        <MainForm />
      </Card>
      <Card className={additionalInfoCardStyles}>
        <AdditionalForm />
      </Card>
    </div>
  );
}

export default observer(CorrespondenceInfoCard);

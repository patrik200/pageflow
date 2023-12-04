import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import MainView from "./MainView";
import AdditionalView from "./AdditionalView";

import { mainInfoCardStyles, wrapperStyles, additionalInfoCardStyles } from "./style.css";

interface CorrespondenceDetailMainEditInterface {
  loading: boolean;
  entity: EditCorrespondenceEntity;
  showPermissions: boolean;
}

function CorrespondenceDetailMainEdit({ loading, entity, showPermissions }: CorrespondenceDetailMainEditInterface) {
  return (
    <div className={wrapperStyles}>
      <Card className={mainInfoCardStyles}>
        <MainView loading={loading} entity={entity} />
      </Card>
      {showPermissions && (
        <Card className={additionalInfoCardStyles}>
          <AdditionalView loading={loading} entity={entity} />
        </Card>
      )}
    </div>
  );
}

export default observer(CorrespondenceDetailMainEdit);

import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import MainContent from "./MainContent";
import ResponsibleContent from "./ResponsibleContent";
import DocumentPermissions from "./PermissionsContent";

import {
  responsibleCardStyles,
  wrapperStyles,
  mainCardStyles,
  additionalCardsWrapperStyles,
  permissionsCardStyles,
} from "./style.css";

interface DocumentDetailMainEditInterface {
  loading: boolean;
  entity: EditDocumentEntity;
  showPermissions: boolean;
}

function DocumentDetailMainEdit({ loading, entity, showPermissions }: DocumentDetailMainEditInterface) {
  return (
    <div className={wrapperStyles}>
      <Card className={mainCardStyles}>
        <MainContent loading={loading} entity={entity} />
      </Card>
      <div className={additionalCardsWrapperStyles}>
        <Card className={responsibleCardStyles}>
          <ResponsibleContent loading={loading} entity={entity} />
        </Card>
        {showPermissions && (
          <Card className={permissionsCardStyles}>
            <DocumentPermissions loading={loading} entity={entity} />
          </Card>
        )}
      </div>
    </div>
  );
}

export default observer(DocumentDetailMainEdit);

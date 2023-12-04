import React from "react";
import { observer } from "mobx-react-lite";
import { Icon, Typography } from "@app/ui-kit";

import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import { deleteIconStyles, typeStyles, valueStyles, wrapperStyles } from "./style.css";

interface AttributeInterface {
  value: AttributeInEntityEntity;
  canDelete?: boolean;
  onDelete?: () => void;
}

function Attribute({ value, canDelete, onDelete }: AttributeInterface) {
  return (
    <div className={wrapperStyles}>
      <Typography className={typeStyles}>{value.attributeType.key}</Typography>
      <Typography className={valueStyles}>{value.value}</Typography>
      {canDelete && <Icon className={deleteIconStyles} icon="closeLine" onClick={onDelete} />}
    </div>
  );
}

export default observer(Attribute);

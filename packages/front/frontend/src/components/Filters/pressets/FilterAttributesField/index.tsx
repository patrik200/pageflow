import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import { Typography } from "@app/ui-kit";
import { AttributeCategory } from "@app/shared-enums";

import Attribute from "components/FormField/Attributes/Attribute";
import CreateAttribute from "components/FormField/Attributes/CreateAttribute";

import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import { attributesStyles, titleStyles, wrapperStyles } from "./style.css";

interface FilterAttributesFieldInterface {
  className?: string;
  title: string;
  category: AttributeCategory;
  attributes: AttributeInEntityEntity[];
  onDelete: (index: number) => void;
  onCreate: (entity: AttributeInEntityEntity) => void;
}

function FilterAttributesField({
  className,
  title,
  category,
  attributes,
  onDelete,
  onCreate,
}: FilterAttributesFieldInterface) {
  const handleDeleteFabric = useMemoizeCallback((index: number) => () => onDelete(index), [onDelete], identity);

  return (
    <div className={cn(className, wrapperStyles)}>
      <Typography className={titleStyles}>{title}</Typography>
      <div className={attributesStyles}>
        {attributes.map((attribute, key) => (
          <Attribute key={key} value={attribute} canDelete onDelete={handleDeleteFabric(key)} />
        ))}
        <CreateAttribute category={category} onlyAppending onCreate={onCreate} />
      </div>
    </div>
  );
}

export default observer(FilterAttributesField);

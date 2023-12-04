import React from "react";
import { observer } from "mobx-react-lite";
import { Icon } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";
import { AttributeCategory } from "@app/shared-enums";

import { AttributeInEntityEntity } from "core/entities/attributes/attribute-in-entity";

import CreateAttributeModal from "./Modal";

import { buttonStyles } from "./style.css";

interface CreateAttributeInterface {
  onlyAppending: boolean;
  category: AttributeCategory;
  onCreate: (entity: AttributeInEntityEntity) => void;
}

function CreateAttribute({ category, onlyAppending, onCreate }: CreateAttributeInterface) {
  const [opened, open, close] = useBoolean(false);

  return (
    <>
      <Icon className={buttonStyles} icon="plusLine" onClick={open} />
      <CreateAttributeModal
        opened={opened}
        category={category}
        onlyAppending={onlyAppending}
        onCreate={onCreate}
        onClose={close}
      />
    </>
  );
}

export default observer(CreateAttribute);

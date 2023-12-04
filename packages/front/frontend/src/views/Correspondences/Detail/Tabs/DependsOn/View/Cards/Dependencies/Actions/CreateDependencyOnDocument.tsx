import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import CreateCorrespondenceDependencyOnDocumentModal from "../../../../Modals/DependsOn";

function CreateDependencyOnDocument() {
  const { t } = useTranslation("correspondence-dependencies");

  const [isModalOpened, openModal, closeModal] = useBoolean(false);

  return (
    <>
      <Button iconLeft="plusLine" size="SMALL" type="PRIMARY" preventDefault={false} onClick={openModal}>
        {t({ scope: "actions", place: "create_dependency", name: "title" })}
      </Button>
      <CreateCorrespondenceDependencyOnDocumentModal opened={isModalOpened} onClose={closeModal} />
    </>
  );
}

export default observer(CreateDependencyOnDocument);

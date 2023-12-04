import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { Link } from "components/Link";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

interface CorrespondenceEditActionInterface {
  correspondence: CorrespondenceEntity;
}

function CorrespondenceEditAction({ correspondence }: CorrespondenceEditActionInterface) {
  const { t } = useTranslation("correspondence-detail");
  if (!correspondence.resultCanEdit) return null;

  return (
    <Link href={`/correspondences/${correspondence.id}/edit`}>
      <Button preventDefault={false} size="SMALL">
        {t({ scope: "edit_correspondence", place: "action", name: "edit" })}
      </Button>
    </Link>
  );
}

export default observer(CorrespondenceEditAction);

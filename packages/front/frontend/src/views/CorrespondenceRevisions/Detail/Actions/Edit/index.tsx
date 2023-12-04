import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";

import { Link } from "components/Link";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceStorage } from "core/storages/correspondence";

function EditAction() {
  const { t } = useTranslation("correspondence-revision-detail");
  const { containerInstance } = useViewContext();
  const revision = containerInstance.get(CorrespondenceRevisionsStorage).revisionDetail!;
  const correspondence = containerInstance.get(CorrespondenceStorage).correspondenceDetail;

  if (!correspondence?.resultCanEdit) return null;

  return (
    <Link href={`/correspondence-revisions/${revision.id}/edit`}>
      <Button preventDefault={false} size="SMALL">
        {t({ scope: "view_revision", place: "actions", name: "edit" })}
      </Button>
    </Link>
  );
}

export default observer(EditAction);

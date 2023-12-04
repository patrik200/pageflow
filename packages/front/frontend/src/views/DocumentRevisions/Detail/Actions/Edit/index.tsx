import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";

import { Link } from "components/Link";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

function EditAction() {
  const { t } = useTranslation("document-revision-detail");
  const { containerInstance } = useViewContext();

  const { revisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  if (!documentDetail?.resultCanEdit) return null;

  return (
    <Link href={`/document-revisions/${revisionDetail!.id}/edit`}>
      <Button preventDefault={false} size="SMALL">
        {t({ scope: "view_revision", place: "actions", name: "edit" })}
      </Button>
    </Link>
  );
}

export default observer(EditAction);

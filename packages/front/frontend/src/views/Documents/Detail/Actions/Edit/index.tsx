import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { Link } from "components/Link";

import { DocumentEntity } from "core/entities/document/document";

interface DocumentEditActionInterface {
  document: DocumentEntity;
}

function DocumentEditAction({ document }: DocumentEditActionInterface) {
  const { t } = useTranslation("document-detail");
  if (!document.resultCanEdit) return null;

  return (
    <Link href={`/documents/${document.id}/edit`}>
      <Button preventDefault={false} size="SMALL">
        {t({ scope: "view_document", place: "actions", name: "edit" })}
      </Button>
    </Link>
  );
}

export default observer(DocumentEditAction);

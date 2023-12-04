import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { Link, LinkUrl } from "components/Link";

import { DocumentStorage } from "core/storages/document";

function DocumentRevisionsCreateAction() {
  const { t } = useTranslation("document-detail");
  const id = useRouter().query.id as string;
  const href = React.useMemo<LinkUrl>(() => ({ pathname: "/documents/[id]/create-revision", query: { id } }), [id]);

  const { documentDetail } = useViewContext().containerInstance.get(DocumentStorage);

  if (!documentDetail!.resultCanEdit) return null;

  return (
    <Link href={href}>
      <Button size="SMALL" type="OUTLINE" preventDefault={false}>
        {t({ scope: "main_tab_revisions", place: "actions", name: "create_revision" })}
      </Button>
    </Link>
  );
}

export default observer(DocumentRevisionsCreateAction);

import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { Link, LinkUrl } from "components/Link";

import { CorrespondenceStorage } from "core/storages/correspondence";

function CorrespondenceRevisionsCreateAction() {
  const { t } = useTranslation("correspondence-detail");
  const id = useRouter().query.id as string;
  const href = React.useMemo<LinkUrl>(
    () => ({ pathname: "/correspondences/[id]/create-revision", query: { id } }),
    [id],
  );

  const { correspondenceDetail } = useViewContext().containerInstance.get(CorrespondenceStorage);

  if (!correspondenceDetail!.resultCanEdit) return null;

  return (
    <Link href={href}>
      <Button size="SMALL" type="OUTLINE" preventDefault={false}>
        {t({ scope: "main_tab_revisions", place: "actions", name: "create_revision" })}
      </Button>
    </Link>
  );
}

export default observer(CorrespondenceRevisionsCreateAction);

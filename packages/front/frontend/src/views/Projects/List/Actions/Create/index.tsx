import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { Link } from "components/Link";

function CreateProjectAction() {
  const { t } = useTranslation("projects");
  return (
    <Link href="/projects/create">
      <Button size="SMALL" iconLeft="plusLine" preventDefault={false}>
        {t({ scope: "actions", place: "create_project", name: "button" })}
      </Button>
    </Link>
  );
}

export default observer(CreateProjectAction);

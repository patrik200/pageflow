import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { Link } from "components/Link";

function CreateUserAction() {
  const { t } = useTranslation("users-list");

  return (
    <Link href="/users/create">
      <Button size="SMALL" iconLeft="plusLine" preventDefault={false}>
        {t({ scope: "actions", place: "create_user", name: "button" })}
      </Button>
    </Link>
  );
}

export default observer(CreateUserAction);

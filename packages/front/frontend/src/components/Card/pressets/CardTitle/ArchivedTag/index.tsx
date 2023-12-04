import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import cn from "classnames";

import Tag from "components/Tag";

import { tagStyles } from "./style.css";

interface ArchivedTagInterface {
  className?: string;
}

function ArchivedTag({ className }: ArchivedTagInterface) {
  const { t } = useTranslation();
  return (
    <Tag className={cn(className, tagStyles)} text={t({ scope: "card_preset", name: "archived_tag" })} mode="warning" />
  );
}

export default observer(ArchivedTag);

import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";

import { Link, LinkUrl } from "components/Link";

import { titleStyles, wrapperStyles } from "./style.css";

interface HomeTableRowTemplateInterface {
  href: LinkUrl;
  title: string;
  children?: React.ReactNode;
}

function HomeTableRowTemplate({ href, title, children }: HomeTableRowTemplateInterface) {
  return (
    <Link className={wrapperStyles} href={href}>
      <Typography className={titleStyles}>{title}</Typography>
      {children}
    </Link>
  );
}

export default observer(HomeTableRowTemplate);

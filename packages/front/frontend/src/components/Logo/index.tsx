import React from "react";
import { Image, useViewContext } from "@app/front-kit";
import cn from "classnames";
import { Typography } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import { ClientCommonStorage } from "core/storages/client/client-common";

import { clientNameScaleStyleVariants, clientNameStyles, logoStyles, wrapperStyles } from "./style.css";

interface LogoInterface {
  className?: string;
  logoClassName?: string;
  autoScale?: boolean;
}

function Logo({ className, logoClassName, autoScale }: LogoInterface) {
  const { client } = useViewContext().containerInstance.get(ClientCommonStorage);
  const scale = React.useMemo(() => {
    if (!autoScale) return;

    switch (true) {
      case client.name.length < 10:
        return "1";
      case client.name.length < 12:
        return "2";
      case client.name.length < 14:
        return "3";
      case client.name.length < 15:
        return "4";
      case client.name.length < 16:
        return "5";
      case client.name.length < 17:
        return "6";
      default:
        return "7";
    }
  }, [autoScale, client]);

  return (
    <div className={cn(className, wrapperStyles)}>
      <Image className={cn(logoClassName, logoStyles)} src={client.logo?.url ?? "/icons/logo.svg"} alt="logo" />
      <Typography className={cn(clientNameStyles, scale && clientNameScaleStyleVariants[scale])}>
        {client.name}
      </Typography>
    </div>
  );
}

export default observer(Logo);

import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, Image } from "@app/front-kit";
import { PaymentType } from "@app/shared-enums";
import cn from "classnames";
import { Typography } from "@app/ui-kit";

import {
  descriptionStyles,
  disabledStyles,
  imageStyles,
  textsWrapperStyles,
  titleStyles,
  wrapperStyles,
} from "./style.css";

interface SubscriptionPaymentTypeInterface {
  paymentType: PaymentType;
  disabled: boolean;
  description?: string;
  onClick: () => void;
}

function SubscriptionPaymentType({ paymentType, disabled, description, onClick }: SubscriptionPaymentTypeInterface) {
  const { t } = useTranslation("settings");
  const handleClick = React.useCallback(() => {
    if (disabled) return;
    onClick();
  }, [disabled, onClick]);

  return (
    <div className={cn(wrapperStyles, disabled && disabledStyles)} onClick={handleClick}>
      <Image className={imageStyles} src={`/images/payment_types/${paymentType}.svg`} />
      <div className={textsWrapperStyles}>
        <Typography className={titleStyles}>
          {t({ scope: "tab_payments", place: "subscription", name: "payment_methods", parameter: paymentType })}
        </Typography>
        {description && <Typography className={descriptionStyles}>{description}</Typography>}
      </div>
    </div>
  );
}

export default observer(SubscriptionPaymentType);

import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";

import Card from "components/Card";

import { SubscriptionEntity } from "core/entities/subscription/subscription";

import { IntlDateStorage } from "core/storages/intl-date";

import CancelSubscription from "./CancelSubscription";
import BuySubscription from "./BuySubscription";

import { cardStyles, nextPaymentDateStyles, titleStyles } from "./style.css";

interface SubscriptionInfoInterface {
  subscription: SubscriptionEntity;
}

function SubscriptionInfo({ subscription }: SubscriptionInfoInterface) {
  const { t } = useTranslation("settings");
  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const intlDate = React.useMemo(() => getIntlDate(), [getIntlDate]);

  return (
    <Card className={cardStyles}>
      <Typography className={titleStyles}>
        {t({
          scope: "tab_payments",
          place: "subscription",
          name: "title",
          parameter: subscription.active ? "active" : "inactive",
        })}
      </Typography>
      {subscription.nextPaymentAt && (
        <Typography className={nextPaymentDateStyles}>
          {t(
            {
              scope: "tab_payments",
              place: "subscription",
              name: "next_payment_date",
              parameter: subscription.autoRenew ? "next_payment" : "until",
            },
            {
              date: intlDate.formatDate(
                DateTime.fromJSDate(subscription.nextPaymentAt),
                DateMode.DATE_WITH_STRING_MONTH,
              ),
            },
          )}
          <CancelSubscription subscription={subscription} />
        </Typography>
      )}
      <BuySubscription subscription={subscription} />
    </Card>
  );
}

export default observer(SubscriptionInfo);

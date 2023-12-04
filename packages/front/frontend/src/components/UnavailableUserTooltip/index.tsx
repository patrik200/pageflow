import React from "react";
import { Icon, PopupManagerMode, Tooltip, Typography } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";
import { observer } from "mobx-react-lite";

import { IntlDateStorage } from "core/storages/intl-date";

import { popupStyles, tooltipStyles, warningIconStyles } from "./style.css";

interface UnavailableUntilUserTooltipInterface {
  userUnavailableUntil: Date | null;
}

function UnavailableUntilUserTooltip({ userUnavailableUntil }: UnavailableUntilUserTooltipInterface) {
  const { t } = useTranslation();
  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const intlDate = React.useMemo(() => getIntlDate(), [getIntlDate]);

  if (!userUnavailableUntil) return null;

  return (
    <Tooltip
      primaryPlacement="bottom"
      offset={10}
      className={tooltipStyles}
      triggerElement={<Icon icon="errorWarningLine" className={warningIconStyles} />}
      mode={PopupManagerMode.HOVER}
      popupElement={
        <Typography className={popupStyles}>
          {t(
            { scope: "common:user_row", place: "tooltips", name: "unavailable_until" },
            {
              date: intlDate.formatDate(
                DateTime.fromJSDate(new Date(userUnavailableUntil)),
                DateMode.DATE_WITH_STRING_MONTH,
              ),
            },
          )}
        </Typography>
      }
    />
  );
}

export default observer(UnavailableUntilUserTooltip);

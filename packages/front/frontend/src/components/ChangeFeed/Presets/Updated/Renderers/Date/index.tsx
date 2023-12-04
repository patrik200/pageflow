import React from "react";
import { useViewContext } from "@app/front-kit";
import { DateTime } from "luxon";
import { DateMode } from "@worksolutions/utils";

import { IntlDateStorage } from "core/storages/intl-date";

import TextRenderer from "../Text";

interface DateRendererInterface {
  value: string | null;
  options?: Record<string, any>;
}

function DateRenderer({ value, options: { showTime = false } = {} }: DateRendererInterface) {
  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const resultValue = React.useMemo(() => {
    if (!value) return null;
    return getIntlDate().formatDate(
      DateTime.fromISO(value),
      showTime ? DateMode.DATE_TIME_WITH_STRING_MONTH : DateMode.DATE_WITH_STRING_MONTH,
    );
  }, [getIntlDate, showTime, value]);

  return <TextRenderer value={resultValue} />;
}

export default React.memo(DateRenderer);

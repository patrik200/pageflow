import React from "react";
import { TranslationFunction, useTranslation, useViewContext } from "@app/front-kit";
import { DateTime } from "luxon";
import { DateMode, IntlDate, isDateAfter, isDateBefore, isDateSame } from "@worksolutions/utils";

import { TagModeType } from "components/Tag";

import { IntlDateStorage } from "core/storages/intl-date";

export function useDeadlineTexts(
  deadlineDate: Date | undefined,
  approvedDate: Date | undefined,
  deadlineDaysIncludeWeekends: boolean,
) {
  const { t } = useTranslation();

  const { getIntlDate } = useViewContext().containerInstance.get(IntlDateStorage);
  const intlDate = React.useMemo(() => getIntlDate(), [getIntlDate]);

  return React.useMemo(() => {
    if (!deadlineDate) return null;

    const deadline = DateTime.fromJSDate(deadlineDate);
    const approved = approvedDate ? DateTime.fromJSDate(approvedDate) : approvedDate;

    if (!approved) return getDeadlineNotApproved(t, intlDate, deadline, deadlineDaysIncludeWeekends);

    if (isDateAfter({ value: deadline, comparisonWith: approved }))
      return getDeadlineAfterApproved(t, intlDate, approved);

    if (isDateBefore({ value: deadline, comparisonWith: approved }))
      return getDeadlineBeforeApproved(t, intlDate, approved);

    return null;
  }, [approvedDate, deadlineDate, deadlineDaysIncludeWeekends, intlDate, t]);
}

function getDeadlineNotApproved(
  t: TranslationFunction,
  intlDate: IntlDate,
  deadline: DateTime,
  deadlineDaysIncludeWeekends: boolean,
) {
  const now = DateTime.now();

  if (isDateSame({ value: deadline, comparisonWith: now }, "days")) {
    return {
      alert: true,
      tagText: t({ scope: "time", name: "today" }),
      tagMode: getTagModeType(0),
      text: intlDate.formatDate(deadline, DateMode.DATE_WITH_STRING_MONTH),
    };
  }

  const diffDays = Math.abs(Math.ceil(deadline.diff(now, "days").get("days")));

  if (isDateAfter({ value: deadline, comparisonWith: now }, "days")) {
    return {
      alert: true,
      tagText: t(
        {
          scope: "time",
          name: deadlineDaysIncludeWeekends ? "days_plus_remaining" : "days_plus_remaining_working",
        },
        { count: diffDays },
      ),
      tagMode: getTagModeType(diffDays),
      text: intlDate.formatDate(deadline, DateMode.DATE_WITH_STRING_MONTH),
    };
  }

  return {
    alert: false,
    tagText: t(
      {
        scope: "time",
        name: deadlineDaysIncludeWeekends ? "days_minus_remaining" : "days_minus_remaining_working",
      },
      { count: diffDays },
    ),
    tagMode: getTagModeType(0),
    text: intlDate.formatDate(deadline, DateMode.DATE_WITH_STRING_MONTH),
  };
}

function getDeadlineAfterApproved(t: TranslationFunction, intlDate: IntlDate, approved: DateTime) {
  const now = DateTime.now();

  if (isDateSame({ value: now, comparisonWith: approved }, "days")) {
    return {
      alert: false,
      tagText: t({ scope: "time", name: "today" }),
      tagMode: "success" as const,
      text: intlDate.formatDate(approved, DateMode.DATE_WITH_STRING_MONTH),
    };
  }

  if (isDateAfter({ value: now, comparisonWith: approved }, "days")) {
    const diffDays = Math.ceil(now.diff(approved, "days").get("days"));
    return {
      alert: false,
      tagText: t({ scope: "time", name: "days_past" }, { count: diffDays }),
      tagMode: "success" as const,
      text: intlDate.formatDate(approved, DateMode.DATE_WITH_STRING_MONTH),
    };
  }

  return null;
}

function getDeadlineBeforeApproved(t: TranslationFunction, intlDate: IntlDate, approved: DateTime) {
  const now = DateTime.now();

  if (isDateSame({ value: now, comparisonWith: approved }, "days")) {
    return {
      alert: true,
      tagText: t({ scope: "time", name: "today" }),
      tagMode: "error" as const,
      text: intlDate.formatDate(approved, DateMode.DATE_WITH_STRING_MONTH),
    };
  }

  if (isDateAfter({ value: now, comparisonWith: approved }, "days")) {
    const diffDays = Math.ceil(now.diff(approved, "days").get("days"));
    return {
      alert: true,
      tagText: t({ scope: "time", name: "days_past" }, { count: diffDays }),
      tagMode: "success" as const,
      text: intlDate.formatDate(now, DateMode.DATE_WITH_STRING_MONTH),
    };
  }

  return null;
}

function getTagModeType(days: number): TagModeType {
  switch (days) {
    case 0:
      return "error";
    case 1:
      return "warning";
    case 2:
    case 3:
      return "softWarning";
    default:
      return "success";
  }
}

import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import {
  Button,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableCellDefaultText,
  TableHead,
  TableHeadCell,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { DateTime } from "luxon";
import { DateMode } from "@worksolutions/utils";
import { amount } from "@app/kit";

import ActionsTableCell from "components/ActionsTableCell";
import CardTablePreset from "components/Card/pressets/CardTable";
import { Link } from "components/Link";

import { IntlDateStorage } from "core/storages/intl-date";
import { SubscriptionStorage } from "core/storages/subscription";

function PaymentsInfo() {
  const { t, language } = useTranslation("settings");
  const { containerInstance } = useViewContext();
  const { getIntlDate } = containerInstance.get(IntlDateStorage);
  const { payments } = containerInstance.get(SubscriptionStorage);

  const intlDate = React.useMemo(() => getIntlDate(), [getIntlDate]);

  return (
    <CardTablePreset>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>
              {t({ scope: "tab_payments", place: "payments", name: "header", parameter: "created_at" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "tab_payments", place: "payments", name: "header", parameter: "mode" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "tab_payments", place: "payments", name: "header", parameter: "status" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "tab_payments", place: "payments", name: "header", parameter: "amount" })}
            </TableHeadCell>
            <TableHeadCell>{null}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {intlDate.formatDate(DateTime.fromJSDate(payment.createdAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {t({
                    scope: "tab_payments",
                    place: "subscription",
                    name: "payment_modes",
                    parameter: payment.mode,
                  })}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {t({
                    scope: "tab_payments",
                    place: "subscription",
                    name: "payment_statuses",
                    parameter: payment.status,
                  })}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {amount({ language, currency: "RUB" }, payment.amount)}
                </TableCellDefaultText>
              </TableCell>
              <ActionsTableCell size="32">
                {payment.confirmationUrl && (
                  <Link href={payment.confirmationUrl}>
                    {payment.needContinuePayment ? (
                      <Button size="SMALL" preventDefault={false} noWrap>
                        {t({
                          scope: "tab_payments",
                          place: "payments",
                          name: "body",
                          parameter: "continue_payment",
                        })}
                      </Button>
                    ) : (
                      <Icon icon="fileTextLine" />
                    )}
                  </Link>
                )}
              </ActionsTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardTablePreset>
  );
}

export default observer(PaymentsInfo);

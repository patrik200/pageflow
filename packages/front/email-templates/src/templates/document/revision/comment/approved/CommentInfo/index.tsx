import React from "react";
import { DateMode } from "@worksolutions/utils";
import { DateTime } from "luxon";

import { useIntlDate } from "templates/__Wrapper";
import {
  titleTextStyles,
  infoColumnsWrapperStyles,
  leftInfoColumnStyles,
  rightInfoColumnStyles,
  lightTextStyles,
  textStyles,
} from "templates/coreStyles.css";

interface CommentViewInterface {
  authorName: string;
  approvedAt: string;
}

function CommentView({ authorName, approvedAt }: CommentViewInterface) {
  const intlDate = useIntlDate();
  return (
    <>
      <div className={titleTextStyles}>В ревизии документа утвержден комментарий</div>
      <div className={infoColumnsWrapperStyles}>
        <div className={leftInfoColumnStyles}>
          <div className={lightTextStyles}>Автор:</div>
          <div className={lightTextStyles}>Дата утверждения:</div>
        </div>
        <div className={rightInfoColumnStyles}>
          <div className={textStyles}>{authorName}</div>
          <div className={textStyles}>
            {intlDate.formatDate(DateTime.fromISO(approvedAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(CommentView);

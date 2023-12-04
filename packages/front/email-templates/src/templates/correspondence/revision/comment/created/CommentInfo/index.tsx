import React from "react";
import { DateTime } from "luxon";
import { DateMode } from "@worksolutions/utils";

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
  createdAt: string;
}

function CommentView({ authorName, createdAt }: CommentViewInterface) {
  const intlDate = useIntlDate();

  return (
    <>
      <div className={titleTextStyles}>В ревизию корреспонденции добавлен комментарий</div>
      <div className={infoColumnsWrapperStyles}>
        <div className={leftInfoColumnStyles}>
          <div className={lightTextStyles}>Автор:</div>
          <div className={lightTextStyles}>Дата добавления:</div>
        </div>
        <div className={rightInfoColumnStyles}>
          <div className={textStyles}>{authorName}</div>
          <div className={textStyles}>
            {intlDate.formatDate(DateTime.fromISO(createdAt), DateMode.DATE_TIME_WITH_STRING_MONTH)}
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(CommentView);

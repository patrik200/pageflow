import React from "react";
import { scrollToElement } from "@app/ui-kit";

import Typography from "components/Typography";

import Date from "./icons/Date";
import Users from "./icons/Users";
import Cube from "./icons/Cube";
import Folder from "./icons/Folder";
import Keyboard from "./icons/Keyboard";
import Cycle from "./icons/Cycle";

import {
  leftSideWrapperStyles,
  bodyWrapperStyles,
  contentStyles,
  featureStyles,
  featureTextStyles,
  featuresWrapperStyles,
  highlightedTitleTextStyles,
  leftSidePriceTextStyles,
  leftSidePurchaseButtonStyles,
  leftSidePurchaseButtonTextStyles,
  leftSideTitleStyles,
  leftSideUnderPriceTextStyles,
  titleTextStyles,
  wrapperStyles,
} from "./style.css";

const FEATURES = [
  { icon: <Date />, text: "1 месяц бесплатного использования" },
  { icon: <Users />, text: "Добавление неограниченного количества пользователей" },
  { icon: <Cube />, text: "Доступно 1Гб дискового пространства" },
  { icon: <Folder />, text: "150 Мб в ограниченной версии " },
  { icon: <Keyboard />, text: "Бесплатная техническая поддержка" },
  { icon: <Cycle />, text: "Автоматическое обновление системы" },
];

function TariffPlan() {
  const handleClick = React.useCallback(() => {
    scrollToElement(window, { scrollToElement: document.getElementById("request_form")!, mode: "top" });
  }, []);

  return (
    <div className={wrapperStyles}>
      <div className={contentStyles}>
        <Typography className={titleTextStyles}>
          <Typography className={highlightedTitleTextStyles}>ТАРИФНЫЙ</Typography> ПЛАН
        </Typography>
        <div className={bodyWrapperStyles}>
          <div className={leftSideWrapperStyles}>
            <Typography className={leftSideTitleStyles}>Корпоративная облачная версия</Typography>
            <div>
              <Typography className={leftSidePriceTextStyles}>2 000 ₽</Typography>
              <Typography className={leftSideUnderPriceTextStyles}>в месяц</Typography>
            </div>
            <button onClick={handleClick} className={leftSidePurchaseButtonStyles}>
              <Typography className={leftSidePurchaseButtonTextStyles}>Приобрести</Typography>
            </button>
          </div>
          <div className={featuresWrapperStyles}>
            {FEATURES.map(({ icon, text }, key) => (
              <div key={key} className={featureStyles}>
                {icon}
                <Typography className={featureTextStyles}>{text}</Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TariffPlan);

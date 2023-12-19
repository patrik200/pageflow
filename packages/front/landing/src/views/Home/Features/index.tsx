import React from "react";

import FeatureBlock from "./FeatureBlock";

import { featuresWrapperStyles } from "./style.css";

const FEATURES = [
  {
    title: "Процесс поэтапного согласования",
    body: "Для принятия новой версии документа необходимо пройти все обязательные этапы согласования и получить утверждения от всех участников процесса согласования",
    caption: "Этапы могут быть настроены в соответствии с требованиями вашей компании.",
    image: "/images/blocks/feature1/index.jpg",
    light: false,
    imageOnRightSide: true,
  },
  {
    title: "Обсуждение документов",
    body: "При принятии новых версий документов пользователи могут оставлять комментарии. Документы не будет приняты, пока все комментарии не будут решены.",
    caption: "Комментарии обеспечивают прозрачность и эффективность обсуждений.",
    image: "/images/blocks/feature2/index.jpg",
    light: true,
    imageOnRightSide: false,
  },
  {
    title: "Система оповещений о действиях",
    body: "Система управления документами «PageFlow» обладает мощной системой нотификаций, которая информирует пользователей о любых действиях в системе.",
    caption:
      "Пользователь может получать оповещения об изменениях в версиях документов, комментариях, действиях по документам и других важных событиях.",
    image: "/images/blocks/feature3/index.jpg",
    light: false,
    imageOnRightSide: true,
  },
  {
    title: "Система справочников",
    body: "В «PageFlow» существует возможность устанавливать свои собственные значения справочников для документов и запросов. Это позволяет классифицировать документы и запросы по разным категориям.",
    caption: "Можно использовать для более удобного поиска и фильтрации.",
    image: "/images/blocks/feature4/index.jpg",
    light: true,
    imageOnRightSide: false,
  },
  {
    title: "Система управления задачами",
    body: "«PageFlow» предоставляет систему управления задачами в виде канбан-доски со списком задач. Такой инструмент наглядно помогает отслеживать прогресс по задачам и управлять их приоритетами.",
    caption: "Управление списком задач поможет организовать работу и достичь большей продуктивности. ",
    image: "/images/blocks/feature5/index.jpg",
    light: false,
    imageOnRightSide: true,
  },
];

function Features() {
  return (
    <div className={featuresWrapperStyles}>
      {FEATURES.map(({ body, caption, image, imageOnRightSide, light, title }, index) => (
        <FeatureBlock
          key={index}
          body={body}
          caption={caption}
          image={image}
          title={title}
          light={light}
          number={index + 1}
          imageOnRightSide={imageOnRightSide}
        />
      ))}
    </div>
  );
}

export default React.memo(Features);

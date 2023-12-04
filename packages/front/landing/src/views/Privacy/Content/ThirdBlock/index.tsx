import React from "react";

import Point from "components/TermsAndPrivacy/Point";
import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function ThirdBlock() {
  return (
    <BlockWrapper>
      <Title>3. Права и обязанности правообладателя</Title>

      <Paragraph number="18.">Правообладатель вправе:</Paragraph>
      <Point>Вносить изменения и дополнения в ПО «Листоход» с целью улучшения его работы;</Point>
      <Point>
        Прекратить предоставление возможности использовать ПО «Листоход» при нарушении Пользователем условий настоящего
        Соглашения;
      </Point>
      <Point>
        Без объяснения причины отказать Пользователю в приобретении права использования ПО «Листоход», заключении с
        Пользователем Лицензионного договора. Настоящее Соглашение не является предварительным.
      </Point>

      <Paragraph number="19.">Обязанности Правообладателя:</Paragraph>
      <Point>Предоставлять Пользователю круглосуточный доступ к использованию функций ПО «Листоход»;</Point>
      <Point>
        Оказывать Пользователю поддержку по всем вопросам, касающимся функционирования ПО «Листоход», на условиях,
        определённых в п. 8 настоящего Соглашения.
      </Point>
    </BlockWrapper>
  );
}

export default React.memo(ThirdBlock);

import React from "react";

import Point from "components/TermsAndPrivacy/Point";
import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function FirstBlock() {
  return (
    <BlockWrapper>
      <Title>1. Общие положения</Title>

      <Paragraph number="1.">Сторонами настоящего Лицензионного соглашения (далее – Соглашение) являются:</Paragraph>
      <Point>
        Администрация Сервиса Листоход в лице Индивидуального предпринимателя Маркелова Евгения Юрьевича (далее –
        Правообладатель);
      </Point>
      <Point>
        Любое лицо, как физическое, так и юридическое, осуществляющее использование облачной версии Программы для ЭВМ
        «Листоход» (далее – ПО «Листоход») на условиях, определённых в настоящем Соглашении (далее – Пользователь).
      </Point>

      <Paragraph number="2.">
        ПО «Листоход» предназначено для автоматизации бизнес-процессов, в том числе организации не сложного электронного
        документооборота в предприятиях малого и среднего бизнеса.
      </Paragraph>

      <Paragraph number="3.">Правообладателем ПО «Листоход» является ИП Маркелов Евгений Юрьевич.</Paragraph>

      <Paragraph number="4.">
        ПО «Листоход» является «облачным» программным обеспечением. Экземпляр ПО «Листоход» расположен на сервере
        Правообладателя, арендуемом у хостинг-провайдера.
      </Paragraph>
    </BlockWrapper>
  );
}

export default React.memo(FirstBlock);

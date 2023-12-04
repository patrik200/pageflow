import React from "react";

import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function FifthBlock() {
  return (
    <BlockWrapper>
      <Title>5. Прочие условия</Title>

      <Paragraph number="19.">
        Администрация Сервиса Листоход имеет право вносить изменения в настоящую Политику конфиденциальности.
      </Paragraph>
      <Paragraph number="20.">
        Новая редакция Политики в обязательном порядке размещается на интернет-сайте Сервиса Листоход и вступает в силу
        с момента такого размещения.
      </Paragraph>
      <Paragraph number="21.">
        Действующая редакция Политики конфиденциальности постоянно доступна для любого Пользователя Сервиса Листоход по
        адресу: https://listohod.ru/privacy/
      </Paragraph>
      <Paragraph number="22.">
        Информация о Правообладателе ПО «Листоход»: Правообладатель ПО «Листоход» на основании свидетельства о
        государственной регистрации программы для ЭВМ № 2016614203 от
        <div>18 апреля 2016г.</div>
        <div>ИП Маркелов Евгений Юрьевич; Свидетельство 77 № 017186942; ОГРНИП 315774600196814;</div>
        <div>E-Mail для связи: em@listohod.ru</div>
      </Paragraph>
    </BlockWrapper>
  );
}

export default React.memo(FifthBlock);

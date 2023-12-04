import React from "react";

import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function FirstBlock() {
  return (
    <BlockWrapper>
      <Title>1. Общие положения</Title>

      <Paragraph number="1.">
        Предметом регулирования настоящей Политики конфиденциальности являются правоотношения между владельцем
        Интернет-ресурса «Listohod.ru» (далее – Сервис Листоход) и его Пользователями (посетителями), связанные с
        обработкой персональных данных Пользователей Администрацией Сервиса Листоход.
      </Paragraph>

      <Paragraph number="2.">
        Использование Сервиса Листоход означает согласие Пользователя с настоящей Политикой и указанными в ней условиями
        обработки его персональных данных.
      </Paragraph>

      <Paragraph number="3.">
        В случае несогласия с настоящей Политикой Пользователь должен воздержаться от использования сервисов,
        предоставляемых Сервисом Листоход.
      </Paragraph>
    </BlockWrapper>
  );
}

export default React.memo(FirstBlock);

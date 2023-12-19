import React from "react";

import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function SixthBlock() {
  return (
    <BlockWrapper>
      <Title>6. Заключительные положения</Title>

      <Paragraph number="27.">
        Настоящее Соглашение представляет собой договор между Пользователем и Правообладателем относительно порядка
        использования облачной версии ПО «Пейджфлоу».
      </Paragraph>
      <Paragraph number="28.">
        Правоотношения, возникающие вследствие выполнения Сторонами обязательств по настоящему Соглашению, регулируются
        в соответствии с законодательством Российской Федерации. Вопросы, не урегулированные настоящим Соглашением,
        подлежат разрешению в соответствии с законодательством Российской Федерации.
      </Paragraph>
      <Paragraph number="29.">
        Все возможные споры, вытекающие из отношений, регулируемых настоящим Соглашением, разрешаются в порядке,
        установленном действующим законодательством Российской Федерации, по нормам российского права.
      </Paragraph>
      <Paragraph number="30.">
        Информация о Правообладателе ПО «Пейджфлоу»:
        <div>ИП Грабаров Анатолий Викторович; ИНН 614089368930; ОГРНИП 321619600158665;</div>
        <div>E-Mail для связи: info@pageflow.ru</div>
      </Paragraph>
    </BlockWrapper>
  );
}

export default React.memo(SixthBlock);

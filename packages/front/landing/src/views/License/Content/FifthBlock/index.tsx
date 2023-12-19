import React from "react";

import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function FifthBlock() {
  return (
    <BlockWrapper>
      <Title>5. Ответственность сторон</Title>

      <Paragraph number="23.">
        Правообладатель не несет ответственность за полные или частичные прерывания в работоспособности ПО «Пейджфлоу»,
        связанные с заменой/сбоями оборудования, программного обеспечения или проведения ремонтных, профилактических и
        иных работ, действием провайдеров или иными причинами, не зависящими от воли Правообладателя.
      </Paragraph>
      <Paragraph number="24.">
        Правообладатель не несет ответственность за обеспечение безопасности и корректную работу оборудования и
        программного обеспечения, используемого им для доступа к функциям ПО «Пейджфлоу».
      </Paragraph>
      <Paragraph number="25.">
        Правообладатель не несёт ответственности за противоправные действия Пользователя в ходе использования ПО
        «Пейджфлоу» (например, за размещение материалов порнографического характера, документов и материалов,
        перечисленных в под. b) – d) п. 22 настоящего Соглашения, а также в случае предъявления к Пользователю претензий
        за такие нарушения со стороны третьих лиц.
      </Paragraph>
      <Paragraph number="26.">
        Стороны несут ответственность за надлежащее выполнение своих обязательств по настоящему Соглашению в
        соответствии с законодательством Российской Федерации.
      </Paragraph>
    </BlockWrapper>
  );
}

export default React.memo(FifthBlock);
import React from "react";

import Point from "components/TermsAndPrivacy/Point";
import Title from "components/TermsAndPrivacy/Title";
import Paragraph from "components/TermsAndPrivacy/Paragraph";
import BlockWrapper from "components/TermsAndPrivacy/BlockWrapper";

function FourthBlock() {
  return (
    <BlockWrapper>
      <Title>4. Условия обработки персональных данных пользователей и иё передачи третьим лицам</Title>

      <Paragraph number="11.">
        Администрация Сервиса Листоход осуществляет хранение персональных данных Пользователей.
      </Paragraph>

      <Paragraph number="12.">
        В отношении персональных данных Пользователей сохраняется ее конфиденциальность, кроме случаев добровольного
        предоставления Пользователем информации о себе для общего доступа неограниченному кругу лиц.
      </Paragraph>

      <Paragraph number="13.">
        При использовании Сервиса Листоход Пользователь соглашается с тем, что определённая часть его персональной
        информации может становиться общедоступной.
      </Paragraph>

      <Paragraph number="14.">
        Администрация Сервиса Листоход вправе передать персональную информацию Пользователя третьим лицам в следующих
        случаях:
      </Paragraph>
      <Point>Пользователь выразил согласие на такие действия;</Point>
      <Point>
        Передача необходима для использования Пользователем Сервиса Листоход либо для исполнения определенного
        соглашения или договора с Пользователем;
      </Point>
      <Point>
        Передача предусмотрена российским или иным применимым законодательством в рамках установленной законодательством
        процедуры;
      </Point>
      <Point>
        Такая передача происходит в рамках продажи или иной передачи бизнеса (полностью или в части), при этом к
        приобретателю переходят все обязательства по соблюдению условий настоящей Политики применительно к полученной им
        персональной информации;
      </Point>
      <Point>
        В целях обеспечения возможности защиты прав и законных интересов Администрации Сервиса Листоход, Пользователей
        Сервиса Листоход или третьих лиц в случаях, когда Пользователь нарушает Пользовательское соглашение, настоящую
        Политику, либо документы, содержащие условия использования Сервиса Листоход.
      </Point>

      <Paragraph number="15.">
        Пользователь может в любой момент изменить (обновить, дополнить) предоставленные им персональные данные или их
        часть, воспользовавшись функцией редактирования персональных данных в персональном разделе Сервиса Листоход.
      </Paragraph>

      <Paragraph number="16.">
        Пользователь может удалить предоставленную им в рамках своей учетной записи персональную информацию,
        воспользовавшись соответствующим интерфейсом Программы.
      </Paragraph>

      <Paragraph number="17.">
        Права, предусмотренные пп. 14 и 15 настоящей Политики, могут быть ограничены в соответствии с требованиями
        законодательства Российской Федерации. В частности, такие ограничения могут предусматривать обязанность
        Администрации Сервиса Листоход сохранить измененную или удаленную Пользователем информацию на срок,
        установленный законодательством, и передать такую информацию в соответствии с законодательно установленной
        процедурой государственному органу.
      </Paragraph>

      <Paragraph number="18.">
        Администрация Сервиса Листоход принимает все необходимые и достаточные организационные и технические меры для
        защиты персональной информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения,
        блокирования, копирования, распространения, а также от иных неправомерных действий с ней третьих лиц.
      </Paragraph>
    </BlockWrapper>
  );
}

export default React.memo(FourthBlock);
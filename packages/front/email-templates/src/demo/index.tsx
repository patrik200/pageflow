import React from "react";
import ReactDOM from "react-dom/client";

import {
  ClientCreated,
  DocumentCreated,
  DocumentUpdated,
  DocumentRevisionCreated,
  DocumentRevisionUpdated,
  DocumentRevisionCommentCreated,
  DocumentRevisionCommentApproved,
  CorrespondenceCreated,
  CorrespondenceUpdated,
  CorrespondenceRevisionCreated,
  CorrespondenceRevisionUpdated,
  ProjectCreated,
  ProjectUpdated,
  CorrespondenceRevisionCommentCreated,
  TicketCreated,
  TicketUpdated,
  ResetPasswordCreated,
  InvitationCreated,
  ProjectEndDateNotified,
  ProjectEndDateOverdue,
  DocumentRevisionApprovingDeadlineAppeared,
  DocumentRevisionUserFlowDeadlineAppeared,
} from "../main";

const root = document.getElementById("root")!;

function RunDemonstrator() {
  return (
    <>
      <ClientCreated frontendHost="http://localhost:3000" adminEmail="admin@pageflow.ru" adminPassword="123456" />
      <ResetPasswordCreated token="1234" frontendHost="http://localhost:3000" />
      <DocumentCreated
        frontendHost="http://localhost:3000"
        id="1"
        name="Важные пароли"
        authorName="Некий автор"
        createdAt={new Date().toISOString()}
      />
      <DocumentUpdated
        frontendHost="http://localhost:3000"
        id="1"
        name="Важные пароли"
        updatedAt={new Date().toISOString()}
      />
      <DocumentRevisionCreated
        frontendHost="http://localhost:3000"
        documentName="Важные пароли"
        number="Ревизия 1"
        id="1"
        authorName="Некий автор"
        createdAt={new Date().toISOString()}
        responsibleUserName="Работник"
        responsibleUserFlowName="Маршрут"
      />
      <DocumentRevisionUpdated
        frontendHost="http://localhost:3000"
        number="Ревизия 1"
        id="1"
        updatedAt={new Date().toISOString()}
      />
      <ProjectUpdated
        frontendHost="http://localhost:3000"
        name="Проект 1"
        id="1"
        updatedAt={new Date().toISOString()}
      />
      <ProjectCreated
        frontendHost="http://localhost:3000"
        name="Проект 1"
        id="1"
        createdAt={new Date().toISOString()}
        authorName="Некий автор"
      />
      <ProjectEndDateNotified
        frontendHost="http://localhost:3000"
        name="Проект 1"
        id="1"
        deadlineAt={new Date().toISOString()}
      />
      <ProjectEndDateOverdue
        frontendHost="http://localhost:3000"
        name="Проект 1"
        id="1"
        deadlineAt={new Date().toISOString()}
      />
      <CorrespondenceRevisionUpdated
        frontendHost="http://localhost:3000"
        number="Корреспонденция 1"
        id="1"
        updatedAt={new Date().toISOString()}
      />
      <CorrespondenceRevisionCreated
        frontendHost="http://localhost:3000"
        number="Корреспонденция 1"
        id="1"
        createdAt={new Date().toISOString()}
        authorName="Некий автор"
      />
      <CorrespondenceUpdated
        frontendHost="http://localhost:3000"
        name="Документ корреспонденции 1"
        id="1"
        updatedAt={new Date().toISOString()}
      />
      <CorrespondenceCreated
        frontendHost="http://localhost:3000"
        name="Документ корреспонденции 1"
        id="1"
        authorName="Некий автор"
        createdAt={new Date().toISOString()}
      />
      <DocumentRevisionCommentApproved
        frontendHost="http://localhost:3000"
        id="123"
        revisionName="Ревизия 1"
        revisionId="1"
        authorName="Работник"
        approvedAt={new Date().toISOString()}
      />
      <DocumentRevisionCommentCreated
        id="123"
        frontendHost="http://localhost:3000"
        revisionNumber="Ревизия 1"
        revisionId="1"
        authorName="Работник"
        createdAt={new Date().toISOString()}
      />
      <CorrespondenceRevisionCommentCreated
        frontendHost="http://localhost:3000"
        revisionNumber="Корреспонденция 1"
        revisionId="1"
        id="1"
        createdAt={new Date().toISOString()}
        authorName="Некий автор"
      />
      <InvitationCreated
        frontendHost="http://localhost:3000"
        token="123"
        invitationExpiresAt={new Date().toISOString()}
      />
      <TicketCreated
        frontendHost="http://localhost:3000"
        name="Тикет 1"
        id="1"
        createdAt={new Date().toISOString()}
        authorName="Некий автор"
      />
      <TicketUpdated frontendHost="http://localhost:3000" name="Тикет 1" id="1" updatedAt={new Date().toISOString()} />
      <DocumentRevisionApprovingDeadlineAppeared
        frontendHost="http://localhost:3000"
        number="1"
        id="1"
        deadlineAt={new Date().toISOString()}
      />
      <DocumentRevisionUserFlowDeadlineAppeared
        frontendHost="http://localhost:3000"
        number="1"
        id="1"
        deadlineAt={new Date().toISOString()}
      />
    </>
  );
}

ReactDOM.createRoot(root).render(<RunDemonstrator />);

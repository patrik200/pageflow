import { Global, Module } from "@nestjs/common";

import { AppCommandsModule } from "../app-commands";
import { AttributesModule } from "../attributes";
import { CorrespondenceRevisionCommentsModule } from "../correspondence-revision-comments";
import { PermissionsModule } from "../permissions";
import { ElasticModule } from "../elastic";
import { ProjectsModule } from "../projects";
import { StorageModule } from "../storage";
import { AuthModule } from "../auth";
import { UsersModule } from "../users";
import { ClientsModule } from "../clients";
import { CorrespondencesAndGroupsModule } from "../correspondences";
import { CorrespondenceRevisionsModule } from "../correspondence-revisions";
import { DictionaryModule } from "../dictionary";
import { DocumentsAndGroupsModule } from "../documents";
import { DocumentRevisionsModule } from "../document-revisions";
import { DocumentRevisionCommentsModule } from "../document-revision-comments";
import { TicketsModule } from "../tickets";
import { TicketCommentsModule } from "../ticket-comments";
import { ContractorsModule } from "../contractor";
import { EmailModule } from "../email";
import { NotificationsModule } from "../notifications";
import { UserFlowModule } from "../userFlow/module";
import { LandingModule } from "../landing";
import { InvitationsModule } from "../invitations";
import { TicketBoardsModule } from "../ticket-boards";
import { ChangeFeedModule } from "../change-feed";
import { PaymentsModule } from "../payments";
import { SubscriptionModule } from "../subscription";

@Global()
@Module({
  imports: [
    AppCommandsModule,
    AttributesModule,
    StorageModule,
    PermissionsModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    CorrespondencesAndGroupsModule,
    CorrespondenceRevisionsModule,
    CorrespondenceRevisionCommentsModule,
    DictionaryModule,
    DocumentsAndGroupsModule,
    DocumentRevisionsModule,
    DocumentRevisionCommentsModule,
    ProjectsModule,
    TicketsModule,
    TicketCommentsModule,
    TicketBoardsModule,
    ContractorsModule,
    ElasticModule,
    EmailModule,
    NotificationsModule,
    UserFlowModule,
    LandingModule,
    InvitationsModule,
    ChangeFeedModule,
    PaymentsModule,
    SubscriptionModule,
  ],
})
export class MainModule {}

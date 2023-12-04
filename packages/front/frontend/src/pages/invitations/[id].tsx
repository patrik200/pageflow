import { Page } from "@app/front-kit";

import InvitationsView from "views/Invitations";

import { InvitationStorage } from "core/storages/invites";

class InvitationsPage extends Page {
  constructor() {
    super(InvitationsView, [InvitationStorage]);
  }
}

const page = new InvitationsPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;

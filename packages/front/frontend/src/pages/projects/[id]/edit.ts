import { Page } from "@app/front-kit";

import ProjectEditView from "views/Projects/Edit";

import { ProjectStorage } from "core/storages/project";

class ProjectEditPage extends Page {
  constructor() {
    super(ProjectEditView, [ProjectStorage]);
  }
}

const page = new ProjectEditPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;

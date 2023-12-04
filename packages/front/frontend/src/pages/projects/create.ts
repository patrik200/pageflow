import { Page } from "@app/front-kit";

import ProjectCreateView from "views/Projects/Create";

import { ProjectStorage } from "core/storages/project";

class ProjectCreatePage extends Page {
  constructor() {
    super(ProjectCreateView, [ProjectStorage]);
  }
}

const page = new ProjectCreatePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;

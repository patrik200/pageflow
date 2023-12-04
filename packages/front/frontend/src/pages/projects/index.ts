import { Page } from "@app/front-kit";

import ProjectsList from "views/Projects/List";

import { ProjectStorage } from "core/storages/project";

class ProjectsPage extends Page {
  constructor() {
    super(ProjectsList, [ProjectStorage]);
  }
}

const page = new ProjectsPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;

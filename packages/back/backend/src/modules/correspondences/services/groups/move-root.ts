import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { CreateCorrespondenceGroupInterface, CreateCorrespondenceGroupService } from "./create";
import { GetCorrespondenceRootGroupService } from "./get-root";
import { MoveCorrespondenceGroupService } from "./move";
import { MoveCorrespondenceService } from "../correspondences/move";

type MoveRootGroupIdentifier = { movableRootGroupId: string };

@Injectable()
export class MoveCorrespondenceRootGroupService {
  constructor(
    private getCorrespondenceRootGroupService: GetCorrespondenceRootGroupService,
    private correspondenceGroupService: CreateCorrespondenceGroupService,
    private moveCorrespondenceGroupService: MoveCorrespondenceGroupService,
    private moveCorrespondenceService: MoveCorrespondenceService,
  ) {}

  @Transactional()
  async moveRootGroupOrFail(identifierOptions: MoveRootGroupIdentifier, data: CreateCorrespondenceGroupInterface) {
    const movableRootGroup = await this.getCorrespondenceRootGroupService.getCorrespondenceRootGroupOrFail(
      { rootGroupId: identifierOptions.movableRootGroupId },
      {
        loadParentDocument: true,
        loadParentProject: true,
        loadAllChildrenGroups: true,
        loadAllChildrenGroupsParentGroup: true,
        loadAllChildrenCorrespondences: true,
        loadAllChildrenCorrespondencesParentGroup: true,
      },
    );

    const targetGroupId = await this.correspondenceGroupService.createGroupOrFail({}, data);

    await Promise.all([
      ...movableRootGroup.allChildrenCorrespondences.map((correspondence) => {
        if (correspondence.parentGroup) return null;
        return this.moveCorrespondenceService.moveCorrespondenceOrFail(
          { movableCorrespondenceId: correspondence.id, toGroupId: targetGroupId },
          { checkPermissions: false },
        );
      }),
      ...movableRootGroup.allChildrenGroups.map((group) => {
        if (group.parentGroup) return null;
        return this.moveCorrespondenceGroupService.moveGroupOrFail(
          { movableGroupId: group.id, toGroupId: targetGroupId },
          { checkPermissions: false },
        );
      }),
    ]);
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";

import { DeleteCorrespondenceGroupService } from "./delete";
import { DeleteCorrespondenceService } from "../correspondences/delete";

@Injectable()
export class DeleteCorrespondenceRootGroupService {
  constructor(
    @InjectRepository(CorrespondenceRootGroupEntity)
    private correspondenceRootGroupRepository: Repository<CorrespondenceRootGroupEntity>,
    private deleteCorrespondenceGroupService: DeleteCorrespondenceGroupService,
    private deleteCorrespondenceService: DeleteCorrespondenceService,
  ) {}

  @Transactional()
  async deleteGroupOrFail(rootGroupId: string) {
    const rootGroup = await this.correspondenceRootGroupRepository.findOneOrFail({
      where: { id: rootGroupId },
      relations: {
        allChildrenGroups: { parentGroup: true },
        allChildrenCorrespondences: { parentGroup: true },
      },
    });

    await Promise.all([
      ...rootGroup.allChildrenGroups.map(({ id, parentGroup }) => {
        if (parentGroup) return null;
        return this.deleteCorrespondenceGroupService.deleteGroupOrFail(id, { checkPermissions: false });
      }),
      ...rootGroup.allChildrenCorrespondences.map(({ id, parentGroup }) => {
        if (parentGroup) return null;
        return this.deleteCorrespondenceService.deleteCorrespondenceOrFail(id, {
          checkPermissions: false,
        });
      }),
    ]);

    await this.correspondenceRootGroupRepository.delete({ id: rootGroup.id });
  }
}

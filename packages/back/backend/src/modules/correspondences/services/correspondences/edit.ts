import { TypeormUpdateEntity } from "@app/back-kit";
import { AttributeCategory, CorrespondenceStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { UpdateAttributesService } from "modules/attributes";
import { PermissionAccessService } from "modules/permissions";

import { EditCorrespondenceElasticService } from "./elastic";
import { GetCorrespondenceService } from "./get";
import { CorrespondenceUpdated } from "../../events/CorrespondenceUpdated";

export interface UpdateCorrespondenceInterface {
  name?: string;
  description?: string;
  contractorId?: string | null;
  status?: CorrespondenceStatus;
  isPrivate?: boolean;
  attributes?: UpdateCorrespondenceAttribute[];
}

type UpdateCorrespondenceAttribute = {
  typeKey: string;
  value: string;
};

@Injectable()
export class EditCorrespondencesService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    private getCorrespondenceService: GetCorrespondenceService,
    private editCorrespondenceElasticService: EditCorrespondenceElasticService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => UpdateAttributesService)) private updateAttributesService: UpdateAttributesService,
  ) {}

  @Transactional()
  async updateCorrespondenceOrFail(correspondenceId: string, data: UpdateCorrespondenceInterface) {
    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: correspondenceId, entityType: PermissionEntityType.CORRESPONDENCE },
      true,
    );

    const correspondence = await this.getCorrespondenceService.getCorrespondenceOrFail(correspondenceId, {
      loadAttributes: true,
    });

    const updateOptions: TypeormUpdateEntity<CorrespondenceEntity> = {};
    if (data.name !== undefined) updateOptions.name = data.name;
    if (data.description !== undefined) updateOptions.description = data.description;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;

    const [attributes] = await Promise.all([
      this.updateAttributesService.unsafeUpdateAttributes(
        { entityId: correspondence.id, category: AttributeCategory.CORRESPONDENCE },
        data.attributes,
      ),
      this.correspondenceRepository.update(
        correspondence.id,
        Object.assign(
          {},
          updateOptions,
          // typeormUpdateNullOrUndefined<string>(data.contractorId, "contractorId")
        ),
      ),
    ]);

    this.eventEmitter.emit(
      CorrespondenceUpdated.eventName,
      new CorrespondenceUpdated(correspondence.id, correspondence),
    );

    await this.editCorrespondenceElasticService.elasticUpdateCorrespondenceIndexOrFail(correspondence.id, {
      ...data,
      attributes,
    });
  }
}

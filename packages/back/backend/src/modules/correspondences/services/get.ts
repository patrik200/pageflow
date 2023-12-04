import { convertSortingToElasticSearch, ElasticSearchQuery, ElasticService } from "@app/back-kit";
import { CorrespondenceRevisionStatus, CorrespondenceStatus, PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { identity, isNil } from "@worksolutions/utils";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService, PermissionSelectOptions } from "modules/permissions";

import { CorrespondenceSorting } from "../types";
import {
  CreateCorrespondenceInClientIdentifier,
  CreateCorrespondenceInDocumentIdentifier,
  CreateCorrespondenceInGroupIdentifier,
  CreateCorrespondenceInProjectIdentifier,
} from "./correspondences/create";
import { GetCorrespondenceGroupService } from "./groups/get";
import { GetCorrespondenceRootGroupService } from "./groups/get-root";
import { GetCorrespondenceIsFavouritesService } from "./correspondences/favourites";
import { GetCorrespondenceGroupIsFavouritesService } from "./groups/favourites";

interface CorrespondenceGroupsAndCorrespondencesSearchParams {
  search?: string;
  searchInRevisionAttachments?: boolean;
  showArchived?: boolean;
  sorting?: CorrespondenceSorting;
  attributes?: { attributeTypeKey: string; value: string }[];
  author?: string;
}

export type GetSearchCorrespondencesAndGroupsIdentifier =
  | CreateCorrespondenceInClientIdentifier
  | CreateCorrespondenceInProjectIdentifier
  | CreateCorrespondenceInDocumentIdentifier
  | CreateCorrespondenceInGroupIdentifier;

type ElasticIdentifierForSearch = {
  parentGroup: CorrespondenceGroupEntity | null;
  elasticQuery: { must: { correspondence: ElasticSearchQuery[]; revision: ElasticSearchQuery[] } };
};

interface CorrespondenceSelectOptions {
  loadAuthor?: boolean;
  loadAuthorAvatar?: boolean;
}

interface CorrespondenceGroupSelectOptions {
  loadAuthor?: boolean;
  loadAuthorAvatar?: boolean;
}

@Injectable()
export class GetCorrespondenceAndGroupService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    private elasticService: ElasticService,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    private getCorrespondenceRootGroupService: GetCorrespondenceRootGroupService,
    private getCorrespondenceIsFavouritesService: GetCorrespondenceIsFavouritesService,
    private getGroupIsFavouritesService: GetCorrespondenceGroupIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  private getHasSearch(searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams) {
    return !isNil(searchParams.search) && searchParams.search !== "";
  }

  private async getElasticIdentifierForSearch(
    identifier: GetSearchCorrespondencesAndGroupsIdentifier,
    searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams,
  ): Promise<ElasticIdentifierForSearch> {
    const hasSearch = this.getHasSearch(searchParams);

    if ("parentGroupId" in identifier) {
      const parentGroup = await this.getCorrespondenceGroupService.getGroupOrFail(identifier.parentGroupId, {
        loadRootGroup: true,
      });

      return {
        parentGroup,
        elasticQuery: {
          must: {
            correspondence: [
              { term: { rootGroupId: parentGroup.rootGroup.id } },
              hasSearch
                ? this.elasticService.createSearchIdByHierarchyPathQuery("parentGroupIdsPath", parentGroup.id)
                : { term: { parentGroupId: parentGroup.id } },
            ],
            revision: hasSearch
              ? [
                  { term: { correspondenceRootGroupId: parentGroup.rootGroup.id } },
                  this.elasticService.createSearchIdByHierarchyPathQuery(
                    "correspondenceParentGroupIdsPath",
                    parentGroup.id,
                  ),
                ]
              : [],
          },
        },
      };
    }

    const rootGroup = await this.getCorrespondenceRootGroupService.getCorrespondenceRootGroupOrFail(identifier);

    return {
      parentGroup: null,
      elasticQuery: {
        must: {
          correspondence: [
            { term: { rootGroupId: rootGroup.id } },
            hasSearch ? undefined! : { bool: { must_not: { exists: { field: "parentGroupIdsPath" } } } },
          ].filter(Boolean),
          revision: hasSearch ? [{ term: { correspondenceRootGroupId: rootGroup.id } }] : [],
        },
      },
    };
  }

  private addShowOnlyActiveToIdentifierIfNeed(
    identifier: ElasticIdentifierForSearch,
    searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams,
  ) {
    if (searchParams.showArchived) return;
    identifier.elasticQuery.must.revision.push({ term: { status: CorrespondenceRevisionStatus.ACTIVE } });
    identifier.elasticQuery.must.correspondence.push({ term: { status: CorrespondenceStatus.ACTIVE } });
  }

  private addAuthorToIdentifierIfNeed(
    identifier: ElasticIdentifierForSearch,
    searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams,
  ) {
    if (!searchParams.author) return;
    identifier.elasticQuery.must.correspondence.push({ term: { authorId: searchParams.author } });
  }

  private async searchCorrespondencesInElastic(
    identifier: ElasticIdentifierForSearch,
    searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams,
  ) {
    type ElasticCorrespondenceHit = { objectType: string; clientId: string };

    const hasSearch = this.getHasSearch(searchParams);

    return await this.elasticService.searchQueryMatchOrFail<ElasticCorrespondenceHit>(
      "correspondences",
      {
        query: {
          bool: {
            must: [
              ...identifier.elasticQuery.must.correspondence,
              { term: { clientId: getCurrentUser().clientId } },
              hasSearch
                ? { multi_match: { query: searchParams.search!, fields: ["name", "description"], fuzziness: "AUTO" } }
                : undefined!,
              ...(searchParams.attributes?.map((attribute) => ({
                nested: {
                  path: "attributes",
                  query: {
                    bool: {
                      must: [
                        { match: { "attributes.attributeTypeKey": attribute.attributeTypeKey } },
                        { match: { "attributes.value": attribute.value } },
                      ],
                    },
                  },
                },
              })) ?? []),
            ].filter(Boolean),
          },
        },
      },
      { sorting: convertSortingToElasticSearch(searchParams.sorting) },
    );
  }

  private async searchRevisionsInElastic(
    identifier: ElasticIdentifierForSearch,
    searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams,
  ) {
    if (!searchParams.searchInRevisionAttachments) return null;
    const hasSearch = this.getHasSearch(searchParams);
    if (!hasSearch) return null;

    type ElasticRevisionHit = { correspondenceId: string; clientId: string };

    return await this.elasticService.searchQueryMatchOrFail<ElasticRevisionHit>("correspondence-revisions", {
      query: {
        bool: {
          must: [
            ...identifier.elasticQuery.must.revision,
            { term: { clientId: getCurrentUser().clientId } },
            {
              multi_match: {
                query: searchParams.search!,
                fields: ["number", "attachments.attachment.content"],
                fuzziness: "AUTO",
              },
            },
          ],
        },
      },
    });
  }

  private async getDatabaseCorrespondences(
    correspondenceHits: string[],
    selectOptions: CorrespondenceSelectOptions = {},
  ) {
    const unsortedCorrespondences = await this.correspondenceRepository.find({
      where: { id: In(correspondenceHits) },
      relations: {
        author: selectOptions.loadAuthor ? { avatar: selectOptions.loadAuthorAvatar } : false,
      },
    });

    const correspondences = correspondenceHits.map(
      (id) => unsortedCorrespondences.find((correspondence) => correspondence.id === id)!,
    );

    const resultCorrespondences = await Promise.all(
      correspondences.map(async (correspondence) => {
        const hasAccess = await this.permissionAccessService.validateToRead(
          { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
          false,
        );
        if (!hasAccess) return null!;
        return correspondence;
      }),
    );

    return resultCorrespondences.filter(identity);
  }

  private async getDatabaseCorrespondenceGroups(
    groupHits: string[],
    selectOptions: CorrespondenceGroupSelectOptions = {},
  ) {
    const unsortedGroups = await this.correspondenceGroupRepository.find({
      where: { id: In(groupHits) },
      relations: {
        author: selectOptions.loadAuthor ? { avatar: selectOptions.loadAuthorAvatar } : false,
      },
    });

    const groups = groupHits.map((id) => unsortedGroups.find((group) => group.id === id)!);

    const resultGroups = await Promise.all(
      groups.map(async (group) => {
        const hasAccess = await this.permissionAccessService.validateToRead(
          { entityId: group.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
          false,
        );
        if (!hasAccess) return null!;
        return group;
      }),
    );

    return resultGroups.filter(identity);
  }

  async getCorrespondencesAndGroups(
    identifier: GetSearchCorrespondencesAndGroupsIdentifier,
    searchParams: CorrespondenceGroupsAndCorrespondencesSearchParams,
    selectOptions: {
      correspondenceSelectOptions?: CorrespondenceSelectOptions;
      groupSelectOptions?: CorrespondenceGroupSelectOptions;
      permissionSelectOptions?: PermissionSelectOptions;
      loadFavourites?: boolean;
      loadPermissions?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();

    const resultIdentifier = await this.getElasticIdentifierForSearch(identifier, searchParams);
    this.addShowOnlyActiveToIdentifierIfNeed(resultIdentifier, searchParams);
    this.addAuthorToIdentifierIfNeed(resultIdentifier, searchParams);

    const [correspondenceSearchResults, revisionSearchResults] = await Promise.all([
      this.searchCorrespondencesInElastic(resultIdentifier, searchParams),
      this.searchRevisionsInElastic(resultIdentifier, searchParams),
    ]);

    const correspondenceHits = correspondenceSearchResults.hits.filter(
      (hit) => hit._source.objectType === "correspondence",
    );

    const groupHits = correspondenceSearchResults.hits.filter(
      (hit) => hit._source.objectType === "correspondence-group",
    );

    revisionSearchResults?.hits.forEach((hit) =>
      correspondenceHits.push({
        _id: hit._source.correspondenceId,
        _source: { objectType: "correspondence", clientId: hit._source.clientId },
      }),
    );

    const [dbCorrespondences, dbGroups] = await Promise.all([
      this.getDatabaseCorrespondences(
        correspondenceHits.map((hit) => hit._id),
        selectOptions.correspondenceSelectOptions,
      ),
      this.getDatabaseCorrespondenceGroups(
        groupHits.map((hit) => hit._id),
        selectOptions.groupSelectOptions,
      ),
    ]);

    await Promise.all([
      resultIdentifier.parentGroup?.calculateGroupsPath(this.correspondenceGroupRepository),
      selectOptions.loadFavourites &&
        Promise.all(
          dbCorrespondences.map((correspondence) =>
            this.getCorrespondenceIsFavouritesService.loadCorrespondenceIsFavourite(correspondence),
          ),
        ),
      selectOptions.loadFavourites &&
        Promise.all(dbGroups.map((group) => this.getGroupIsFavouritesService.loadGroupIsFavourite(group))),
      selectOptions.loadPermissions &&
        Promise.all(
          dbCorrespondences.map(async (correspondence) => {
            correspondence.permissions = await this.permissionAccessService.getPermissions(
              { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
              selectOptions.permissionSelectOptions,
            );
          }),
        ),
      selectOptions.loadPermissions &&
        Promise.all(
          dbGroups.map(async (group) => {
            group.permissions = await this.permissionAccessService.getPermissions(
              { entityId: group.id, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
              selectOptions.permissionSelectOptions,
            );
          }),
        ),
    ]);

    dbCorrespondences.forEach((correspondence) => correspondence.calculateAllCans(currentUser));

    return {
      correspondenceGroups: dbGroups,
      correspondences: dbCorrespondences,
      groupsPath: resultIdentifier.parentGroup?.groupsPath ?? [],
    };
  }
}

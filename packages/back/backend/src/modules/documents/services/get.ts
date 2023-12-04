import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { convertSortingToElasticSearch, ElasticSearchQuery, ElasticService, typeormAlias } from "@app/back-kit";
import {
  DictionaryTypes,
  DocumentRevisionActiveStatuses,
  DocumentRevisionStatus,
  DocumentStatus,
  PermissionEntityType,
} from "@app/shared-enums";
import { identity, isNil } from "@worksolutions/utils";

import { DocumentEntity } from "entities/Document/Document";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { getCurrentUser } from "modules/auth";
import { GetDictionaryValueService } from "modules/dictionary";
import { PermissionAccessService, PermissionSelectOptions } from "modules/permissions";

import { DocumentSorting } from "../types";
import { CreateDocumentInGroupIdentifier, CreateDocumentInProjectIdentifier } from "./documents/create";
import { GetDocumentIsFavouritesService } from "./documents/favourites";
import { GetDocumentGroupIsFavouritesService } from "./groups/favourites";
import { GetDocumentGroupService } from "./groups/get";
import { GetDocumentRootGroupService } from "./groups/get-root";

interface DocumentGroupsAndDocumentsSearchParams {
  search?: string;
  searchInRevisionAttachments?: boolean;
  lastRevisionStatus?: DocumentRevisionStatus;
  showArchived?: boolean;
  typeKey?: string;
  sorting?: DocumentSorting;
  attributes?: { attributeTypeKey: string; value: string }[];
  author?: string;
  responsibleUser?: string;
}

export type GetSearchDocumentsAndGroupsIdentifier = CreateDocumentInProjectIdentifier | CreateDocumentInGroupIdentifier;

type ElasticIdentifierForSearch = {
  parentGroup: DocumentGroupEntity | null;
  elasticQuery: { must: { document: ElasticSearchQuery[]; revision: ElasticSearchQuery[] } };
};

interface DocumentSelectOptions {
  loadAuthorAvatar?: boolean;
}

interface DocumentGroupSelectOptions {
  loadAuthor?: boolean;
  loadAuthorAvatar?: boolean;
}

@Injectable()
export class GetDocumentsAndGroupsService {
  constructor(
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    private elasticService: ElasticService,
    private getIsFavouritesService: GetDocumentIsFavouritesService,
    private getGroupIsFavouritesService: GetDocumentGroupIsFavouritesService,
    private getDocumentGroupService: GetDocumentGroupService,
    private getDocumentRootGroupService: GetDocumentRootGroupService,
    @Inject(forwardRef(() => GetDictionaryValueService)) private getDictionaryValueService: GetDictionaryValueService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  private getHasSearch(searchParams: DocumentGroupsAndDocumentsSearchParams) {
    return !isNil(searchParams.search) && searchParams.search !== "";
  }

  private async getElasticIdentifierForSearch(
    identifier: GetSearchDocumentsAndGroupsIdentifier,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ): Promise<ElasticIdentifierForSearch> {
    const hasSearch = this.getHasSearch(searchParams);

    if ("parentGroupId" in identifier) {
      const parentGroup = await this.getDocumentGroupService.getGroupOrFail(identifier.parentGroupId, {
        loadRootGroup: true,
      });

      return {
        parentGroup,
        elasticQuery: {
          must: {
            document: [
              { term: { rootGroupId: parentGroup.rootGroup.id } },
              hasSearch
                ? this.elasticService.createSearchIdByHierarchyPathQuery("parentGroupIdsPath", parentGroup.id)
                : { term: { parentGroupId: parentGroup.id } },
            ],
            revision: hasSearch
              ? [
                  { term: { documentRootGroupId: parentGroup.rootGroup.id } },
                  this.elasticService.createSearchIdByHierarchyPathQuery("documentParentGroupIdsPath", parentGroup.id),
                ]
              : [],
          },
        },
      };
    }

    const rootGroup = await this.getDocumentRootGroupService.getDocumentRootGroupOrFail(identifier);

    return {
      parentGroup: null,
      elasticQuery: {
        must: {
          document: [
            { term: { rootGroupId: rootGroup.id } },
            hasSearch ? undefined! : { bool: { must_not: { exists: { field: "parentGroupIdsPath" } } } },
          ].filter(Boolean),
          revision: hasSearch ? [{ term: { documentRootGroupId: rootGroup.id } }] : [],
        },
      },
    };
  }

  private appleShowOnlyActiveToIdentifierIfNeed(
    identifier: ElasticIdentifierForSearch,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ) {
    if (searchParams.showArchived) return;
    identifier.elasticQuery.must.revision.push({ terms: { status: DocumentRevisionActiveStatuses } });
    identifier.elasticQuery.must.document.push({ term: { status: DocumentStatus.ACTIVE } });
  }

  private async addDocumentTypeToIdentifierIfNeed(
    identifier: ElasticIdentifierForSearch,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ) {
    if (!searchParams.typeKey) return;
    const typeValue = await this.getDictionaryValueService.getDictionaryValueOrFail(
      searchParams.typeKey,
      DictionaryTypes.DOCUMENT_TYPE,
    );

    identifier.elasticQuery.must.document.push({ term: { typeId: typeValue.id } });
  }

  private async addAuthorToIdentifierIfNeed(
    identifier: ElasticIdentifierForSearch,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ) {
    if (!searchParams.author) return;
    identifier.elasticQuery.must.document.push({ term: { authorId: searchParams.author } });
  }

  private async addResponsibleUserToIdentifierIfNeed(
    identifier: ElasticIdentifierForSearch,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ) {
    if (!searchParams.responsibleUser) return;
    identifier.elasticQuery.must.document.push({ term: { responsibleUserId: searchParams.responsibleUser } });
  }

  private async searchDocumentsInElastic(
    identifier: ElasticIdentifierForSearch,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ) {
    type ElasticDocumentHit = { objectType: string; clientId: string };

    const hasSearch = this.getHasSearch(searchParams);

    return await this.elasticService.searchQueryMatchOrFail<ElasticDocumentHit>(
      "documents",
      {
        query: {
          bool: {
            must: [
              ...identifier.elasticQuery.must.document,
              { term: { clientId: getCurrentUser().clientId } },
              hasSearch
                ? {
                    multi_match: {
                      query: searchParams.search!,
                      fields: ["name", "description", "remarks"],
                      fuzziness: "AUTO",
                    },
                  }
                : undefined!,
              searchParams.lastRevisionStatus
                ? { term: { lastRevisionStatus: searchParams.lastRevisionStatus } }
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
    searchParams: DocumentGroupsAndDocumentsSearchParams,
  ) {
    if (!searchParams.searchInRevisionAttachments) return null;
    const hasSearch = this.getHasSearch(searchParams);
    if (!hasSearch) return null;

    type ElasticRevisionHit = { documentId: string; clientId: string };

    return await this.elasticService.searchQueryMatchOrFail<ElasticRevisionHit>("document-revisions", {
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

  private async getDatabaseDocuments(documentHits: string[], selectOptions: DocumentSelectOptions = {}) {
    const [unsortedDocuments, documentsWithLastRevisionStatus] = await Promise.all([
      this.documentRepository.find({
        where: { id: In(documentHits) },
        relations: {
          author: {
            avatar: selectOptions.loadAuthorAvatar,
          },
        },
      }),
      this.documentRepository
        .createQueryBuilder(typeormAlias) // TODO: add select
        .where({ id: In(documentHits) })
        .leftJoin(
          (subQuery) =>
            subQuery
              .from(DocumentRevisionEntity, "revision")
              .select("MAX(revision.createdAt)")
              .addSelect("revision.documentId", "documentId")
              .addSelect("revision.status", "status")
              .groupBy("revision.documentId, revision.status"),
          "lastRevision",
          `${typeormAlias}.id = "lastRevision"."documentId"`,
        )
        .addSelect('"lastRevision"."status"', `${typeormAlias}_lastRevisionStatus`)
        .getMany(),
    ]);

    const documents = documentHits.map((id) => unsortedDocuments.find((document) => document.id === id)!);

    documents.forEach((document) => {
      const documentWithLastRevisionStatus = documentsWithLastRevisionStatus.find(
        (documentWithLastRevisionStatus) => documentWithLastRevisionStatus.id === document.id,
      );
      if (!documentWithLastRevisionStatus) return;
      document.lastRevisionStatus = documentWithLastRevisionStatus.lastRevisionStatus;
    });

    const resultDocuments = await Promise.all(
      documents.map(async (document) => {
        const hasAccess = await this.permissionAccessService.validateToRead(
          { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
          false,
        );
        if (!hasAccess) return null!;
        return document;
      }),
    );

    const filteredDocument = resultDocuments.filter(identity);

    const currentUser = getCurrentUser();
    filteredDocument.forEach((document) => document.calculateAllCans(currentUser));

    return filteredDocument;
  }

  private async getDatabaseDocumentGroups(groupHits: string[], selectOptions: DocumentGroupSelectOptions = {}) {
    const unsortedGroups = await this.documentGroupRepository.find({
      where: { id: In(groupHits) },
      relations: {
        author: selectOptions.loadAuthor
          ? {
              avatar: selectOptions.loadAuthorAvatar,
            }
          : false,
      },
    });

    const groups = groupHits.map((id) => unsortedGroups.find((group) => group.id === id)!);

    const resultGroups = await Promise.all(
      groups.map(async (group) => {
        const hasAccess = await this.permissionAccessService.validateToRead(
          { entityId: group.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
          false,
        );
        if (!hasAccess) return null!;
        return group;
      }),
    );

    return resultGroups.filter(identity);
  }

  async getDocumentsAndGroupsOrFail(
    identifier: GetSearchDocumentsAndGroupsIdentifier,
    searchParams: DocumentGroupsAndDocumentsSearchParams,
    selectOptions: {
      documentSelectOptions?: DocumentSelectOptions;
      groupSelectOptions?: DocumentGroupSelectOptions;
      permissionSelectOptions?: PermissionSelectOptions;
      loadFavourites?: boolean;
      loadPermissions?: boolean;
    } = {},
  ) {
    const resultIdentifier = await this.getElasticIdentifierForSearch(identifier, searchParams);
    this.appleShowOnlyActiveToIdentifierIfNeed(resultIdentifier, searchParams);
    await this.addDocumentTypeToIdentifierIfNeed(resultIdentifier, searchParams);
    await this.addAuthorToIdentifierIfNeed(resultIdentifier, searchParams);
    await this.addResponsibleUserToIdentifierIfNeed(resultIdentifier, searchParams);

    const [documentSearchResults, revisionSearchResults] = await Promise.all([
      this.searchDocumentsInElastic(resultIdentifier, searchParams),
      this.searchRevisionsInElastic(resultIdentifier, searchParams),
    ]);

    const documentHits = documentSearchResults.hits.filter((hit) => hit._source.objectType === "document");
    const groupHits = documentSearchResults.hits.filter((hit) => hit._source.objectType === "document-group");

    revisionSearchResults?.hits.forEach((hit) =>
      documentHits.push({
        _id: hit._source.documentId,
        _source: { objectType: "document", clientId: hit._source.clientId },
      }),
    );

    const [dbDocuments, dbGroups] = await Promise.all([
      this.getDatabaseDocuments(
        documentHits.map((hit) => hit._id),
        selectOptions.documentSelectOptions,
      ),
      this.getDatabaseDocumentGroups(
        groupHits.map((hit) => hit._id),
        selectOptions.groupSelectOptions,
      ),
    ]);

    await Promise.all([
      resultIdentifier.parentGroup?.calculateGroupsPath(this.documentGroupRepository),
      selectOptions.loadFavourites &&
        Promise.all(dbDocuments.map((document) => this.getIsFavouritesService.loadDocumentIsFavourite(document))),
      selectOptions.loadFavourites &&
        Promise.all(
          dbGroups.map(
            async (group) => (group.favourite = await this.getGroupIsFavouritesService.getGroupIsFavourite(group.id)),
          ),
        ),
      selectOptions.loadPermissions &&
        Promise.all(
          dbDocuments.map(async (document) => {
            document.permissions = await this.permissionAccessService.getPermissions(
              { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
              selectOptions.permissionSelectOptions,
            );
          }),
        ),
      selectOptions.loadPermissions &&
        Promise.all(
          dbGroups.map(async (group) => {
            group.permissions = await this.permissionAccessService.getPermissions(
              { entityId: group.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
              selectOptions.permissionSelectOptions,
            );
          }),
        ),
    ]);

    return {
      documentGroups: dbGroups,
      documents: dbDocuments,
      groupsPath: resultIdentifier.parentGroup?.groupsPath ?? [],
    };
  }
}

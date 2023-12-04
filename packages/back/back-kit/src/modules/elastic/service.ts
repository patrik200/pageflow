import { Injectable } from "@nestjs/common";
import { config } from "@app/core-config";
import { Client as ElasticClient, errors } from "@elastic/elasticsearch";
import { PaginationQueryInterface } from "@app/kit";
import type { MappingProperty, QueryDslQueryContainer, SortOptions } from "@elastic/elasticsearch/lib/api/types";
import { Readable } from "node:stream";
import { streamToBuffer } from "@jorgeferrero/stream-to-buffer";

export type ElasticDocumentData = Record<string, string | object | string[] | object[] | number | undefined | boolean>;

export type ElasticSearchQuery = QueryDslQueryContainer;

export interface ElasticDocumentId {
  id: string;
  index: string;
}

export interface ElasticDocumentAttachment {
  fileName: string;
  data: Buffer | Readable;
  id: string;
}

@Injectable()
export class ElasticService {
  static async register(elasticConfig = config.elastic) {
    const client = new ElasticClient({ node: `http://${elasticConfig.host}:${elasticConfig.port}` });
    return new ElasticService(client);
  }

  constructor(private client: ElasticClient) {}

  async createIndexIfNotCreatedOrFail(indexName: string) {
    try {
      await this.client.indices.create({ index: indexName });
      return true;
    } catch (e) {
      if (e instanceof errors.ResponseError) {
        return e.message.includes("resource_already_exists_exception") ? ("already_exists" as const) : false;
      }
      return false;
    }
  }

  async setMappingOrFail(indexName: string, data: Record<string, MappingProperty>) {
    await this.client.indices.putMapping({
      index: indexName,
      dynamic: "runtime",
      properties: data,
    });
  }

  getDocumentId(index: string, id: string, postfix?: string): ElasticDocumentId {
    const key = index + "_" + id;
    if (postfix) return { id: key + "_" + postfix, index };
    return { id: key, index };
  }

  async addDocumentOrFail(documentId: ElasticDocumentId, data: ElasticDocumentData, refreshIndex = true) {
    await this.client.index({
      index: documentId.index,
      id: documentId.id,
      document: data,
      refresh: refreshIndex,
    });
  }

  async updateDocumentOrFail(documentId: ElasticDocumentId, data: ElasticDocumentData, refreshIndex = true) {
    await this.client.update({
      index: documentId.index,
      id: documentId.id,
      doc: data,
      refresh: refreshIndex,
    });
  }

  async forceRefreshIndexOrFail(indexName: string | string[]) {
    await this.client.indices.refresh({ index: indexName });
  }

  private revertDocumentId(id: string) {
    const [, resultId] = id.split("_");
    return resultId;
  }

  private getPaginationForSearch(pagination: PaginationQueryInterface | undefined) {
    if (!pagination) return { size: 10000 };
    return { from: (pagination.page - 1) * pagination.perPage, size: pagination.perPage };
  }

  async searchQueryMatchOrFail<SOURCE extends Record<string, any>>(
    indexName: string | string[],
    body: { query: ElasticSearchQuery },
    { pagination, sorting }: { pagination?: PaginationQueryInterface; sorting?: SortOptions } = {},
  ) {
    const { hits } = await this.client.search({
      index: indexName,
      body: { query: body.query },
      ...this.getPaginationForSearch(pagination),
      sort: sorting,
    });

    return {
      hits: hits.hits.map<{ _id: string; _source: SOURCE }>((hit) => ({
        _id: this.revertDocumentId(hit._id),
        _source: hit._source as SOURCE,
      })),
      total: hits.total === undefined ? 0 : typeof hits.total === "number" ? hits.total : hits.total.value,
    };
  }

  async deleteIndexDocumentOrFail(documentId: ElasticDocumentId, refreshIndex = true) {
    await this.client.delete({ index: documentId.index, id: documentId.id, refresh: refreshIndex });
  }

  async deleteAllIndexesOrFail(term: Record<string, any>) {
    await this.client.deleteByQuery({ index: "_all", body: { query: { term } } });
  }

  updateNullOrUndefined<VALUE extends string | number, KEY extends string = string>(
    value: VALUE | null | undefined,
    key: KEY,
    externalValue?: VALUE | null,
  ) {
    if (value === undefined) return undefined;
    return { [key]: externalValue ?? value ?? null };
  }

  getAttachmentMapping(fieldName: string): Record<string, MappingProperty> {
    return {
      [fieldName]: {
        properties: {
          attachment: {
            properties: {
              content: { type: "text" },
              content_length: { type: "long" },
              content_type: { type: "text" },
              language: { type: "text" },
            },
          },
          data: { type: "text" },
          filename: { type: "text" },
          id: { type: "text" },
        },
      },
    };
  }

  async createAttachmentProcessorIfNotCreatedOrFail(fieldName: string) {
    await this.client.ingest.putPipeline({
      id: "attachment-processor",
      processors: [
        {
          foreach: {
            field: fieldName,
            processor: {
              attachment: {
                target_field: "_ingest._value.attachment",
                field: "_ingest._value.data",
              },
            },
          },
        },
      ],
    });
  }

  async addDocumentAttachmentOrFail(
    documentId: ElasticDocumentId,
    fieldName: string,
    file: ElasticDocumentAttachment,
    { refreshIndex = true, waitForIndex = true }: { refreshIndex?: boolean; waitForIndex?: boolean } = {},
  ) {
    const { _source: currentDocumentContent = {} } = await this.client.get<Record<string, any>>({
      index: documentId.index,
      id: documentId.id,
    });

    const indexPromise = (Buffer.isBuffer(file.data) ? Promise.resolve(file.data) : streamToBuffer(file.data))
      .then((file) => file.toString("base64"))
      .then((fileBase64) =>
        this.client.index({
          index: documentId.index,
          id: documentId.id,
          document: {
            ...currentDocumentContent,
            [fieldName]: [
              ...(currentDocumentContent[fieldName] ?? []),
              { id: file.id, filename: file.fileName, data: fileBase64 },
            ],
          },
          pipeline: "attachment-processor",
          refresh: refreshIndex,
        }),
      );

    if (waitForIndex) await indexPromise;
  }

  async deleteDocumentAttachmentOrFail(
    documentId: ElasticDocumentId,
    fieldName: string,
    fileId: string,
    refreshIndex = true,
  ) {
    const { _source: currentDocumentContent = {} } = await this.client.get<Record<string, any>>({
      index: documentId.index,
      id: documentId.id,
    });

    const attachments = (currentDocumentContent[fieldName] ?? []).filter(
      (attachment: { id: string }) => attachment.id !== fileId,
    );

    await this.client.index({
      index: documentId.index,
      id: documentId.id,
      document: { ...currentDocumentContent, [fieldName]: attachments },
      pipeline: "attachment-processor",
      refresh: refreshIndex,
    });
  }

  getHierarchyPath(ids: string[] | undefined) {
    return ids?.map((id) => id + "__").join("") ?? null;
  }

  createSearchIdByHierarchyPathQuery(hierarchyPathFieldName: string, searchId: string) {
    return { query_string: { default_field: hierarchyPathFieldName, query: "*" + searchId + "__*" } };
  }
}

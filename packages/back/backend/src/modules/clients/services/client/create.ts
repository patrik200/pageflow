import { ServiceError, StorageSaveService } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { ClientEntity } from "entities/Client";

import { dictionariesFixture, dictionaryValuesFixture } from "fixtures/dictionaries";
import { Tariffs } from "fixtures/tariffs";

import { CreateCorrespondenceRootGroupService } from "modules/correspondences";
import { currentUserStorage, emptyCurrentUserStorageValue } from "modules/auth";
import { CreateDictionaryService, CreateDictionaryValueService } from "modules/dictionary";
import { CreateSubscriptionService } from "modules/subscription";

interface CreateClientInterface {
  name: string;
  domain: string;
  tariff: Tariffs;
  filesMemoryLimitByte: number | null;
  addTrial?: boolean;
}

@Injectable()
export class CreateClientService {
  constructor(
    @InjectRepository(ClientEntity) private clientsRepository: Repository<ClientEntity>,
    private storageSaveService: StorageSaveService,
    @Inject(forwardRef(() => CreateCorrespondenceRootGroupService))
    private createCorrespondenceRootGroupService: CreateCorrespondenceRootGroupService,
    @Inject(forwardRef(() => CreateDictionaryService)) private createDictionaryService: CreateDictionaryService,
    @Inject(forwardRef(() => CreateDictionaryValueService))
    private createDictionaryValueService: CreateDictionaryValueService,
    @Inject(forwardRef(() => CreateSubscriptionService)) private createSubscriptionService: CreateSubscriptionService,
  ) {}

  private async initializeSubscription(clientId: string, options: { tariff: Tariffs; addTrial: boolean | undefined }) {
    await this.createSubscriptionService.dangerCreateSubscriptionOrFail({
      clientId,
      tariff: options.tariff,
      addTrial: options.addTrial,
    });
  }

  private async initializeClientBuckets(clientId: string) {
    const userAvatarsBucket = await this.storageSaveService.createBucketIfNotExists(`client.${clientId}.user-avatars`);
    if (!userAvatarsBucket) throw new ServiceError("files", "Не удалось создать хранилище файлов [user-avatars]");

    const logosBucket = await this.storageSaveService.createBucketIfNotExists(`client.${clientId}.logo`);
    if (!logosBucket) throw new ServiceError("files", "Не удалось создать хранилище файлов [logo]");

    const documentsBucket = await this.storageSaveService.createBucketIfNotExists(`client.${clientId}.documents`);
    if (!documentsBucket) throw new ServiceError("files", "Не удалось создать хранилище файлов [documents]");

    const correspondencesBucket = await this.storageSaveService.createBucketIfNotExists(
      `client.${clientId}.correspondences`,
    );
    if (!correspondencesBucket)
      throw new ServiceError("files", "Не удалось создать хранилище файлов [correspondences]");

    const ticketsBucket = await this.storageSaveService.createBucketIfNotExists(`client.${clientId}.tickets`);
    if (!ticketsBucket) throw new ServiceError("files", "Не удалось создать хранилище файлов [tickets]");

    const contractorsBucket = await this.storageSaveService.createBucketIfNotExists(`client.${clientId}.contractors`);
    if (!contractorsBucket) throw new ServiceError("files", "Не удалось создать хранилище файлов [contractors]");

    const projectsBucket = await this.storageSaveService.createBucketIfNotExists(`client.${clientId}.projects`);
    if (!projectsBucket) throw new ServiceError("files", "Не удалось создать хранилище файлов [projects]");
  }

  async validateDomain(domain: string) {
    const matched = new RegExp(`^[-a-z0-9.]{1,128}$`).test(domain);
    if (!matched) return false;
    const foundClient = await this.clientsRepository.findOne({ where: { domain }, select: ["id", "domain"] });
    if (foundClient) return false;
    return true;
  }

  @Transactional()
  private async createCorrespondenceRootGroupAndSaveOrFail(clientId: string) {
    await currentUserStorage.run({ ...emptyCurrentUserStorageValue, clientId }, () =>
      this.createCorrespondenceRootGroupService.createGroupOrFail({}, { name: "Root for client " + clientId }),
    );
  }

  @Transactional()
  private async initializeFixtures(clientId: string, language: "ru") {
    await currentUserStorage.run({ ...emptyCurrentUserStorageValue, clientId }, async () => {
      for (const [dictionaryType, dictionaryOptions] of dictionariesFixture.entries()) {
        const dictionaryId = await this.createDictionaryService.createDictionaryOrFail({
          type: dictionaryType,
          ...dictionaryOptions,
        });

        for (const [key, { value, canDelete }] of dictionaryValuesFixture.get(dictionaryType)!.entries()) {
          await this.createDictionaryValueService.createDictionaryValueOrFail(dictionaryId, {
            key,
            value: value[language],
            canDelete,
          });
        }
      }
    });
  }

  @Transactional()
  async createClientOrFail({ name, domain, tariff, filesMemoryLimitByte, addTrial }: CreateClientInterface) {
    const domainValid = await this.validateDomain(domain);
    if (!domainValid) throw new ServiceError("domain", "Не валидный домен");

    const client = await this.clientsRepository.save({ name, domain, filesMemoryLimitByte });
    await this.initializeSubscription(client.id, { tariff, addTrial });
    await this.initializeClientBuckets(client.id);
    await this.createCorrespondenceRootGroupAndSaveOrFail(client.id);
    await this.initializeFixtures(client.id, "ru");

    return client.id;
  }
}

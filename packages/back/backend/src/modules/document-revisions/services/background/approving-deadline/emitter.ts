import { errorLogBeautifier } from "@app/back-kit";
import { config } from "@app/core-config";
import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isDateAfter, setAsyncInterval } from "@worksolutions/utils";
import { IsNull, Not, Repository } from "typeorm";
import chalk from "chalk";
import { DateTime } from "luxon";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { DocumentRevisionApprovingDeadline } from "../../../events/RevisionApprovingDeadline";

@Injectable()
export class DocumentRevisionApprovingDeadlineEmitterService implements OnApplicationBootstrap, OnApplicationShutdown {
  private loggerContext = "Revision approving prolong deadline emitter";

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(DocumentRevisionEntity) private documentRevisionRepository: Repository<DocumentRevisionEntity>,
  ) {}

  private isReadyToNotify(revision: DocumentRevisionEntity) {
    if (revision.approvingDeadline === null) return false;
    return isDateAfter({ value: DateTime.now(), comparisonWith: DateTime.fromJSDate(revision.approvingDeadline) });
  }

  private async checkRevision(revision: DocumentRevisionEntity) {
    try {
      if (!this.isReadyToNotify(revision)) return;
      await this.documentRevisionRepository.update(revision.id, { approvingDeadlineNotified: true });
      this.eventEmitter.emit(
        DocumentRevisionApprovingDeadline.eventName,
        new DocumentRevisionApprovingDeadline(revision.id),
      );
    } catch (e) {
      Logger.error(`Error while notify userFlow:`, this.loggerContext);
      errorLogBeautifier(e);
    }
  }

  private async checkApprovingDeadline() {
    const revisions = await this.documentRevisionRepository.find({
      where: {
        approvingDeadline: Not(IsNull()),
        approvingDeadlineNotified: false,
      },
    });

    await Promise.all(revisions.map((revision) => this.checkRevision(revision)));
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkApprovingDeadline();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.documentRevisions.approvingDeadlineCheckIntervalMs}ms`)}]`,
      this.loggerContext,
    );
    this.disposeTimer = setAsyncInterval(
      () => this.checkApprovingDeadline(),
      config.documentRevisions.approvingDeadlineCheckIntervalMs,
    );
  }

  onApplicationBootstrap() {
    void this.run();
  }

  onApplicationShutdown() {
    this.disposeTimer?.();
  }
}

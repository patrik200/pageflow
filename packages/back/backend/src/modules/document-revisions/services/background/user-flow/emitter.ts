import { errorLogBeautifier } from "@app/back-kit";
import { config } from "@app/core-config";
import { DocumentRevisionStatus } from "@app/shared-enums";
import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isDateAfter, setAsyncInterval } from "@worksolutions/utils";
import { IsNull, Not, Repository } from "typeorm";
import chalk from "chalk";
import { DateTime } from "luxon";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";

import { DocumentRevisionUserFlowDeadline } from "../../../events/RevisionUserFlowDeadline";

@Injectable()
export class DocumentRevisionUserFlowDeadlineEmitterService implements OnApplicationBootstrap, OnApplicationShutdown {
  private loggerContext = "Revision user flow deadline emitter";

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private documentRevisionResponsibleUserFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
  ) {}

  private isReadyToNotify(userFlow: DocumentRevisionResponsibleUserFlowEntity) {
    if (userFlow.deadlineDate === null) return false;
    return isDateAfter({ value: DateTime.now(), comparisonWith: DateTime.fromJSDate(userFlow.deadlineDate) });
  }

  private async checkUserFlow(userFlow: DocumentRevisionResponsibleUserFlowEntity) {
    try {
      if (!this.isReadyToNotify(userFlow)) return;
      await this.documentRevisionResponsibleUserFlowRepository.update(userFlow.id, {
        deadlineDaysNotified: true,
      });
      this.eventEmitter.emit(
        DocumentRevisionUserFlowDeadline.eventName,
        new DocumentRevisionUserFlowDeadline(userFlow.id),
      );
    } catch (e) {
      Logger.error(`Error while notify userFlow:`, this.loggerContext);
      errorLogBeautifier(e);
    }
  }

  private async checkUserFlowDeadlines() {
    const userFlows = await this.documentRevisionResponsibleUserFlowRepository.find({
      where: {
        revision: { status: DocumentRevisionStatus.REVIEW },
        deadlineDaysNotified: false,
        deadlineDaysAmount: Not(IsNull()),
      },
      relations: {
        revision: true,
      },
    });

    await Promise.all(userFlows.map((userFlow) => this.checkUserFlow(userFlow)));
  }

  private disposeTimer: Function | undefined;
  private async run() {
    await this.checkUserFlowDeadlines();
    Logger.log(
      `Run checking with interval [${chalk.cyan(`${config.documentRevisions.userFlowDeadlineCheckIntervalMs}ms`)}]`,
      this.loggerContext,
    );
    this.disposeTimer = setAsyncInterval(
      () => this.checkUserFlowDeadlines(),
      config.documentRevisions.userFlowDeadlineCheckIntervalMs,
    );
  }

  onApplicationBootstrap() {
    void this.run();
  }

  async onApplicationShutdown() {
    this.disposeTimer?.();
  }
}

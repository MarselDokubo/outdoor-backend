import { newId } from "../../../shared/ids.js";
import { Impression } from "../../../domain/engagement/impression.js";
import type { ImpressionRepository } from "../../../domain/engagement/repositories/impression.repository.js";
import type { ImpressionView, RecordImpressionCommand } from "../impression.contracts.js";
import type { ImpressionTargetAccessService } from "./impression-query-services.js";

const DEDUPE_WINDOW_MINUTES = 30;

export class RecordImpressionUseCase {
  constructor(
    private readonly impressionRepository: ImpressionRepository,
    private readonly targetAccessService: ImpressionTargetAccessService,
  ) {}

  public async execute(command: RecordImpressionCommand): Promise<ImpressionView> {
    const actorUserId = command.actorUserId ?? null;
    const sessionKey = command.sessionKey ?? null;

    await this.targetAccessService.assertTargetViewable({
      actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    const since = new Date(Date.now() - DEDUPE_WINDOW_MINUTES * 60 * 1000);

    if (actorUserId) {
      const existing = await this.impressionRepository.findRecentByViewer({
        targetType: command.targetType,
        targetId: command.targetId,
        viewerUserId: actorUserId,
        since,
      });

      if (existing) {
        return toView(existing);
      }
    } else if (sessionKey) {
      const existing = await this.impressionRepository.findRecentBySession({
        targetType: command.targetType,
        targetId: command.targetId,
        sessionKey,
        since,
      });

      if (existing) {
        return toView(existing);
      }
    }

    const impression = Impression.create({
      id: newId("impression"),
      targetType: command.targetType,
      targetId: command.targetId,
      viewerUserId: actorUserId,
      sessionKey,
    });

    await this.impressionRepository.save(impression);
    return toView(impression);
  }
}

function toView(impression: Impression): ImpressionView {
  const data = impression.toObject();

  return {
    id: data.id,
    targetType: data.targetType,
    targetId: data.targetId,
    viewerUserId: data.viewerUserId,
    sessionKey: data.sessionKey,
    createdAt: data.createdAt.toISOString(),
  };
}

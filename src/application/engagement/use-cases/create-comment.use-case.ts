import { newId } from "../../../shared/ids.js";
import { Comment } from "../../../domain/engagement/comment.js";
import type { CommentRepository } from "../../../domain/engagement/repositories/comment.repository.js";
import type { CreateCommentCommand, CommentView } from "../comment.contracts.js";
import type { CommentTargetAccessService } from "./comment-query-services.js";

export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly targetAccessService: CommentTargetAccessService,
  ) {}

  public async execute(command: CreateCommentCommand): Promise<CommentView> {
    await this.targetAccessService.assertTargetViewable({
      actorUserId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
    });

    const comment = Comment.create({
      id: newId("comment"),
      authorUserId: command.actorUserId,
      targetType: command.targetType,
      targetId: command.targetId,
      body: command.body,
    });

    await this.commentRepository.save(comment);

    return toView(comment);
  }
}

function toView(comment: Comment): CommentView {
  const data = comment.toObject();

  return {
    id: data.id,
    authorUserId: data.authorUserId,
    targetType: data.targetType,
    targetId: data.targetId,
    body: data.status === "DELETED" ? null : data.body,
    status: data.status,
    editedAt: data.editedAt?.toISOString() ?? null,
    deletedAt: data.deletedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}

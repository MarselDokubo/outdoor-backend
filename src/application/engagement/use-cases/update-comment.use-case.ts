import { CommentNotFoundError } from "../../../domain/engagement/comment.errors.js";
import type { CommentRepository } from "../../../domain/engagement/repositories/comment.repository.js";
import type { CommentView, UpdateCommentCommand } from "../comment.contracts.js";

export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  public async execute(command: UpdateCommentCommand): Promise<CommentView> {
    const comment = await this.commentRepository.findById(command.commentId);

    if (!comment) {
      throw new CommentNotFoundError();
    }

    comment.update(command.actorUserId, command.body);
    await this.commentRepository.save(comment);

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
}

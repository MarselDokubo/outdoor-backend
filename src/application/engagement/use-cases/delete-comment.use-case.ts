import { CommentNotFoundError } from "../../../domain/engagement/comment.errors.js";
import type { CommentRepository } from "../../../domain/engagement/repositories/comment.repository.js";
import type { CommentView, DeleteCommentCommand } from "../comment.contracts.js";

export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  public async execute(command: DeleteCommentCommand): Promise<CommentView> {
    const comment = await this.commentRepository.findById(command.commentId);

    if (!comment) {
      throw new CommentNotFoundError();
    }

    comment.delete(command.actorUserId);
    await this.commentRepository.save(comment);

    const data = comment.toObject();

    return {
      id: data.id,
      authorUserId: data.authorUserId,
      targetType: data.targetType,
      targetId: data.targetId,
      body: null,
      status: data.status,
      editedAt: data.editedAt?.toISOString() ?? null,
      deletedAt: data.deletedAt?.toISOString() ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }
}

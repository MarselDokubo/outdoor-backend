import { PrismaCommentRepository } from "../../infrastructure/persistence/prisma/prisma-comment.repository.js";
import { PrismaCommentQueryService } from "../../infrastructure/persistence/prisma/prisma-comment-query.repository.js";
import { PrismaEngagementTargetAccessService } from "../../infrastructure/persistence/prisma/prisma-engagement-target-access.service.js";
import type { EngagementPrismaClient } from "../../infrastructure/persistence/prisma/engagement-prisma.types.js";
import { CreateCommentUseCase } from "./use-cases/create-comment.use-case.js";
import { UpdateCommentUseCase } from "./use-cases/update-comment.use-case.js";
import { DeleteCommentUseCase } from "./use-cases/delete-comment.use-case.js";
import { GetCommentDetailsUseCase } from "./use-cases/get-comment-details.use-case.js";
import { ListTargetCommentsUseCase } from "./use-cases/list-target-comments.use-case.js";
import { ListMyCommentsUseCase } from "./use-cases/list-my-comments.use-case.js";

export function buildCommentModule(prisma: EngagementPrismaClient) {
  const commentRepository = new PrismaCommentRepository(prisma);
  const commentQueryService = new PrismaCommentQueryService(prisma);
  const targetAccessService = new PrismaEngagementTargetAccessService(prisma);

  return {
    createComment: new CreateCommentUseCase(commentRepository, targetAccessService),
    updateComment: new UpdateCommentUseCase(commentRepository),
    deleteComment: new DeleteCommentUseCase(commentRepository),
    getCommentDetails: new GetCommentDetailsUseCase(commentQueryService, targetAccessService),
    listTargetComments: new ListTargetCommentsUseCase(commentQueryService, targetAccessService),
    listMyComments: new ListMyCommentsUseCase(commentQueryService),
  };
}

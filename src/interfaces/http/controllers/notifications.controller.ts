import type { Request, Response } from "express";
import { z } from "zod";
import type { NotificationQueueService } from "../../../application/services/notification-queue.service";
import { getValidatedBody } from "../../../shared/http/get-validated";
import { sendSuccess } from "../../../shared/http/api-response";

const enqueueNotificationBodySchema = z.object({
  recipient: z.string().min(1),
  channel: z.enum(["email", "push", "in-app"]),
  subject: z.string().min(1),
  message: z.string().min(1),
  fingerprint: z.string().optional(),
});

export type EnqueueNotificationBody = z.infer<typeof enqueueNotificationBodySchema>;

export class NotificationsController {
  constructor(private readonly notificationQueueService: NotificationQueueService) {}

  static bodySchema = enqueueNotificationBodySchema;

  enqueue = async (_req: Request, res: Response): Promise<void> => {
    const body = getValidatedBody<EnqueueNotificationBody>(res.locals);

    await this.notificationQueueService.enqueueSend({
      recipient: body.recipient,
      channel: body.channel,
      subject: body.subject,
      message: body.message,
      ...(body.fingerprint ? { fingerprint: body.fingerprint } : {}),
    });

    sendSuccess(res, { queued: true }, { statusCode: 202 });
  };
}

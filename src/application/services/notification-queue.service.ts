import type { Queue } from "bullmq";
import {
  notificationJobNames,
  type SendNotificationJobData,
} from "../jobs/notification-dispatch.job";

export class NotificationQueueService {
  constructor(private readonly notificationQueue: Queue) {}

  async enqueueSend(data: SendNotificationJobData): Promise<void> {
    await this.notificationQueue.add(notificationJobNames.sendNotification, data, {
      ...(data.fingerprint
        ? {
            jobId: `${data.channel}:${data.recipient}:${data.fingerprint}`,
          }
        : {}),
    });
  }
}

import type { Job} from "bullmq";
import { Worker } from "bullmq";
import {
  notificationJobNames,
  type SendNotificationJobData,
} from "../../application/jobs/notification-dispatch.job";
import { queueNames } from "../../application/jobs/queue-names";
import { logger } from "../../infrastructure/logging/logger";
import { createBullMqWorkerConnection } from "../../infrastructure/queues/bullmq";

const workerLogger = logger.child({ component: "notification-worker" });

async function handleSendNotification(job: Job<SendNotificationJobData>): Promise<void> {
  const { recipient, channel, subject, message } = job.data;

  workerLogger.info(
    {
      jobId: job.id,
      recipient,
      channel,
      subject,
    },
    "dispatching notification",
  );

  // Placeholder implementation for now.
  // Replace later with real email/push/in-app delivery providers.
  workerLogger.info(
    {
      jobId: job.id,
      recipient,
      channel,
      message,
    },
    "notification dispatched",
  );
}

export const notificationWorker = new Worker(
  queueNames.notificationDispatch,
  async (job) => {
    switch (job.name) {
      case notificationJobNames.sendNotification:
        await handleSendNotification(job as Job<SendNotificationJobData>);
        return;

      default:
        throw new Error(`Unsupported job name: ${job.name}`);
    }
  },
  {
    connection: createBullMqWorkerConnection(),
  },
);

notificationWorker.on("completed", (job) => {
  workerLogger.info({ jobId: job.id, jobName: job.name }, "job completed");
});

notificationWorker.on("failed", (job, error) => {
  workerLogger.error(
    {
      jobId: job?.id,
      jobName: job?.name,
      err: error,
    },
    "job failed",
  );
});

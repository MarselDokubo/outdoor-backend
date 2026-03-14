import { Queue } from "bullmq";
import { queueNames } from "../../application/jobs/queue-names";
import { createBullMqQueueConnection } from "./bullmq";

export const notificationQueue = new Queue(queueNames.notificationDispatch, {
  connection: createBullMqQueueConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

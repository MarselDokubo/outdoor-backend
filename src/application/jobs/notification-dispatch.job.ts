export const notificationJobNames = {
  sendNotification: "send-notification",
} as const;

export interface SendNotificationJobData {
  recipient: string;
  channel: "email" | "push" | "in-app";
  subject: string;
  message: string;
  fingerprint?: string;
}

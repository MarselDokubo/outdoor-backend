import { env } from "../../config/env";

const appPrefix = "outdoor";

function namespace(): string {
  return `${appPrefix}:${env.NODE_ENV}`;
}

export const redisKeys = {
  notification: {
    dedupe: (kind: string, recipient: string, fingerprint: string) =>
      `${namespace()}:notification:dedupe:${kind}:${recipient}:${fingerprint}`,
  },

  cache: {
    placeDetails: (placeId: string) => `${namespace()}:cache:place:details:${placeId}`,
    homepageFeed: (userId: string) => `${namespace()}:cache:feed:homepage:${userId}`,
  },

  lock: {
    notificationDispatch: (recipient: string) =>
      `${namespace()}:lock:notification-dispatch:${recipient}`,
  },
} as const;

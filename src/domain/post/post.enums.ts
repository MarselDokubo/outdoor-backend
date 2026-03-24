export const POST_PUBLICATION_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type PostPublicationStatus = (typeof POST_PUBLICATION_STATUSES)[number];

export const POST_VISIBILITIES = ["PUBLIC", "UNLISTED", "PRIVATE"] as const;
export type PostVisibility = (typeof POST_VISIBILITIES)[number];

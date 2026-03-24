export const MEDIA_KINDS = ["IMAGE", "VIDEO"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const MEDIA_PROCESSING_STATUSES = ["UPLOADED", "READY", "FAILED", "DELETED"] as const;
export type MediaProcessingStatus = (typeof MEDIA_PROCESSING_STATUSES)[number];

export const MEDIA_ATTACHMENT_OWNER_TYPES = ["PLACE", "POST", "EVENT"] as const;
export type MediaAttachmentOwnerType = (typeof MEDIA_ATTACHMENT_OWNER_TYPES)[number];

export const MEDIA_ATTACHMENT_ROLES = ["PRIMARY", "GALLERY", "CONTENT"] as const;
export type MediaAttachmentRole = (typeof MEDIA_ATTACHMENT_ROLES)[number];

export function inferMediaKindFromMimeType(mimeType: string): MediaKind {
  if (mimeType.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimeType.startsWith("video/")) {
    return "VIDEO";
  }

  throw new Error(`Unsupported media mime type: ${mimeType}`);
}

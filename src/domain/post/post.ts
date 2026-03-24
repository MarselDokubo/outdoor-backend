import { PostBody } from "./post-body.js";
import type { PostPublicationStatus, PostVisibility } from "./post.enums.js";
import { PostForbiddenError, PostStateError } from "./post.errors.js";

export interface CreatePostProps {
  id: string;
  authorUserId: string;
  placeId: string;
  body: string;
  visibility: PostVisibility;
}

export interface RehydratePostProps {
  id: string;
  authorUserId: string;
  placeId: string;
  body: string;
  visibility: PostVisibility;
  publicationStatus: PostPublicationStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  archivedAt: Date | null;
}

export class Post {
  private constructor(
    public readonly id: string,
    public readonly authorUserId: string,
    public readonly placeId: string,
    private bodyValue: PostBody,
    private visibilityValue: PostVisibility,
    private publicationStatusValue: PostPublicationStatus,
    public readonly createdAt: Date,
    private updatedAtValue: Date,
    private publishedAtValue: Date | null,
    private archivedAtValue: Date | null,
  ) {}

  public static create(props: CreatePostProps): Post {
    const now = new Date();

    return new Post(
      props.id,
      props.authorUserId,
      props.placeId,
      PostBody.create(props.body),
      props.visibility,
      "DRAFT",
      now,
      now,
      null,
      null,
    );
  }

  public static rehydrate(props: RehydratePostProps): Post {
    return new Post(
      props.id,
      props.authorUserId,
      props.placeId,
      PostBody.create(props.body),
      props.visibility,
      props.publicationStatus,
      props.createdAt,
      props.updatedAt,
      props.publishedAt,
      props.archivedAt,
    );
  }

  public get body(): string {
    return this.bodyValue.value;
  }

  public get visibility(): PostVisibility {
    return this.visibilityValue;
  }

  public get publicationStatus(): PostPublicationStatus {
    return this.publicationStatusValue;
  }

  public get updatedAt(): Date {
    return this.updatedAtValue;
  }

  public get publishedAt(): Date | null {
    return this.publishedAtValue;
  }

  public get archivedAt(): Date | null {
    return this.archivedAtValue;
  }

  public updateDraft(actorUserId: string, body: string, visibility: PostVisibility): void {
    this.assertAuthor(actorUserId);
    this.assertDraft();

    this.bodyValue = PostBody.create(body);
    this.visibilityValue = visibility;
    this.updatedAtValue = new Date();
  }

  public publish(actorUserId: string): void {
    this.assertAuthor(actorUserId);

    if (this.publicationStatusValue === "PUBLISHED") {
      return;
    }

    if (this.publicationStatusValue === "ARCHIVED") {
      throw new PostStateError("Archived posts cannot be published again.");
    }

    this.publicationStatusValue = "PUBLISHED";
    this.publishedAtValue = new Date();
    this.updatedAtValue = this.publishedAtValue;
  }

  public archive(actorUserId: string): void {
    this.assertAuthor(actorUserId);

    if (this.publicationStatusValue === "ARCHIVED") {
      return;
    }

    this.publicationStatusValue = "ARCHIVED";
    this.archivedAtValue = new Date();
    this.updatedAtValue = this.archivedAtValue;
  }

  private assertAuthor(actorUserId: string): void {
    if (this.authorUserId !== actorUserId) {
      throw new PostForbiddenError("Only the post author can perform this action.");
    }
  }

  private assertDraft(): void {
    if (this.publicationStatusValue !== "DRAFT") {
      throw new PostStateError("Only draft posts can be updated.");
    }
  }
}

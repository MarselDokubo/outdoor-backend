import type { Readable } from "node:stream";

export interface PutObjectInput {
  key: string;
  body: Buffer;
  contentType: string;
}

export interface PutObjectResult {
  key: string;
  checksumSha256: string;
  sizeBytes: number;
}

export interface StoredObjectRead {
  stream: Readable;
  contentLength: number;
  contentType?: string | undefined;
}

export interface ObjectStorageService {
  putObject(input: PutObjectInput): Promise<PutObjectResult>;
  getObject(key: string): Promise<StoredObjectRead>;
  deleteObject(key: string): Promise<void>;
}

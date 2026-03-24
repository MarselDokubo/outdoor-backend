import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import type {
  ObjectStorageService,
  PutObjectInput,
  PutObjectResult,
  StoredObjectRead,
} from "../../application/media/use-cases/object-storage.js";

const DEFAULT_MEDIA_STORAGE_ROOT = "var/media";

export class LocalObjectStorageService implements ObjectStorageService {
  constructor(
    private readonly rootDir: string = resolve(process.cwd(), DEFAULT_MEDIA_STORAGE_ROOT),
  ) {}

  public async putObject(input: PutObjectInput): Promise<PutObjectResult> {
    const absolutePath = this.getAbsolutePath(input.key);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, input.body);

    const checksumSha256 = createHash("sha256").update(input.body).digest("hex");

    return {
      key: input.key,
      checksumSha256,
      sizeBytes: input.body.byteLength,
    };
  }

  public async getObject(key: string): Promise<StoredObjectRead> {
    const absolutePath = this.getAbsolutePath(key);
    const info = await stat(absolutePath);

    return {
      stream: createReadStream(absolutePath),
      contentLength: info.size,
    };
  }

  public async deleteObject(key: string): Promise<void> {
    const absolutePath = this.getAbsolutePath(key);
    await rm(absolutePath, { force: true });
  }

  private getAbsolutePath(key: string): string {
    return join(this.rootDir, key);
  }
}

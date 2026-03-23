import { PlaceSlug } from "../../../domain/place/place-slug.js";
import type {
  PlaceRepository,
  PlaceSlugUniquenessService,
} from "../../../domain/place/repositories/index.js";

export class PrismaPlaceSlugUniquenessService implements PlaceSlugUniquenessService {
  constructor(private readonly places: PlaceRepository) {}

  public async generateUniqueSlug(baseName: string): Promise<string> {
    const baseSlug = PlaceSlug.fromName(baseName).toString();
    let candidate = baseSlug;
    let counter = 2;

    while (await this.places.existsSlug(candidate)) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return candidate;
  }
}

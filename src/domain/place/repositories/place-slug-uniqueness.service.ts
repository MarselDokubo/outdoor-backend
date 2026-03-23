export interface PlaceSlugUniquenessService {
  generateUniqueSlug(baseName: string): Promise<string>;
}

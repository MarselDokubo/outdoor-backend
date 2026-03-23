import { PlaceConflictError, PlaceForbiddenError } from "./place.errors.js";
import {
  type PlacePublicationStatus,
  type PlaceSourceType,
  type PlaceVisibility,
} from "./place.enums.js";
import { PlaceCategory } from "./place-category.js";
import { PlaceContactDetails, type PlaceContactDetailsProps } from "./place-contact-details.js";
import { PlaceDescription, type PlaceDescriptionProps } from "./place-description.js";
import { PlaceLocation, type PlaceLocationProps } from "./place-location.js";
import { PlaceName } from "./place-name.js";
import { PlaceSlug } from "./place-slug.js";

export interface CreatePlaceProps {
  id: string;
  slug: string;
  name: string;
  category: string;
  descriptions?: PlaceDescriptionProps | undefined;
  contactDetails?: PlaceContactDetailsProps | undefined;
  location: PlaceLocationProps;
  publicationStatus?: PlacePublicationStatus | undefined;
  visibility?: PlaceVisibility | undefined;
  sourceType?: PlaceSourceType | undefined;
  createdByUserId: string;
  officialTagline?: string | null | undefined;
  officialSummary?: string | null | undefined;
  isOwnerManaged?: boolean | undefined;
  isVerified?: boolean | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  archivedAt?: Date | null | undefined;
}

export type RehydratePlaceProps = CreatePlaceProps;

export class Place {
  private constructor(
    public readonly id: string,
    private slug: PlaceSlug,
    private name: PlaceName,
    private category: PlaceCategory,
    private description: PlaceDescription,
    private contactDetails: PlaceContactDetails,
    private location: PlaceLocation,
    private publicationStatus: PlacePublicationStatus,
    private visibility: PlaceVisibility,
    public readonly createdByUserId: string,
    private sourceType: PlaceSourceType,
    private officialTagline: string | null,
    private officialSummary: string | null,
    private isOwnerManaged: boolean,
    private isVerified: boolean,
    public readonly createdAt: Date,
    private updatedAt: Date,
    private archivedAt: Date | null,
  ) {}

  public static create(props: CreatePlaceProps): Place {
    const entity = new Place(
      props.id,
      PlaceSlug.create(props.slug),
      PlaceName.create(props.name),
      PlaceCategory.create(props.category),
      PlaceDescription.create(props.descriptions ?? {}),
      PlaceContactDetails.create(props.contactDetails ?? {}),
      PlaceLocation.create(props.location),
      props.publicationStatus ?? "DRAFT",
      props.visibility ?? "PRIVATE",
      props.createdByUserId,
      props.sourceType ?? "USER_SUBMITTED",
      normalizeOptionalText(props.officialTagline),
      normalizeOptionalText(props.officialSummary),
      props.isOwnerManaged ?? false,
      props.isVerified ?? false,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.archivedAt ?? null,
    );

    entity.assertValidState();
    return entity;
  }

  public static rehydrate(props: RehydratePlaceProps): Place {
    return Place.create(props);
  }

  public rename(name: string): void {
    this.name = PlaceName.create(name);
    this.touch();
  }

  public recategorize(category: string): void {
    this.category = PlaceCategory.create(category);
    this.touch();
  }

  public updateDescriptions(descriptions: PlaceDescriptionProps): void {
    this.description = PlaceDescription.create(descriptions);
    this.touch();
  }

  public updateContactDetails(contactDetails: PlaceContactDetailsProps): void {
    this.contactDetails = PlaceContactDetails.create(contactDetails);
    this.touch();
  }

  public relocate(location: PlaceLocationProps): void {
    this.location = PlaceLocation.create(location);
    this.touch();
  }

  public setVisibility(visibility: PlaceVisibility): void {
    if (this.archivedAt) {
      throw new PlaceForbiddenError("Archived places cannot change visibility.");
    }
    this.visibility = visibility;
    this.touch();
  }

  public publish(): void {
    if (this.publicationStatus === "ARCHIVED") {
      throw new PlaceConflictError("Archived places cannot be republished.");
    }
    this.assertPublishable();
    this.publicationStatus = "PUBLISHED";
    this.touch();
  }

  public archive(): void {
    if (this.publicationStatus === "ARCHIVED") {
      return;
    }
    this.publicationStatus = "ARCHIVED";
    this.archivedAt = new Date();
    this.touch();
  }

  public updateOfficialProfile(input: {
    officialTagline?: string | null | undefined;
    officialSummary?: string | null | undefined;
    contactDetails?: PlaceContactDetailsProps | undefined;
    descriptions?: PlaceDescriptionProps | undefined;
  }): void {
    this.officialTagline = normalizeOptionalText(input.officialTagline);
    this.officialSummary = normalizeOptionalText(input.officialSummary);
    if (input.contactDetails) {
      this.contactDetails = PlaceContactDetails.create(input.contactDetails);
    }
    if (input.descriptions) {
      this.description = PlaceDescription.create(input.descriptions);
    }
    this.touch();
  }

  public markOwnerManagedVerified(): void {
    this.isOwnerManaged = true;
    this.isVerified = true;
    this.touch();
  }

  public markClaimPending(): void {
    this.isOwnerManaged = true;
    this.touch();
  }

  public toPrimitives() {
    return {
      id: this.id,
      slug: this.slug.toString(),
      name: this.name.toString(),
      category: this.category.toString(),
      shortDescription: this.description.shortDescription,
      fullDescription: this.description.fullDescription,
      phone: this.contactDetails.phone,
      email: this.contactDetails.email,
      website: this.contactDetails.website,
      latitude: this.location.latitude,
      longitude: this.location.longitude,
      addressLine1: this.location.addressLine1,
      addressLine2: this.location.addressLine2,
      area: this.location.area,
      city: this.location.city,
      state: this.location.state,
      postalCode: this.location.postalCode,
      countryCode: this.location.countryCode,
      formattedAddress: this.location.formattedAddress,
      publicationStatus: this.publicationStatus,
      visibility: this.visibility,
      createdByUserId: this.createdByUserId,
      sourceType: this.sourceType,
      officialTagline: this.officialTagline,
      officialSummary: this.officialSummary,
      isOwnerManaged: this.isOwnerManaged,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      archivedAt: this.archivedAt,
    };
  }

  public getPublicationStatus(): PlacePublicationStatus {
    return this.publicationStatus;
  }

  public getVisibility(): PlaceVisibility {
    return this.visibility;
  }

  public getName(): string {
    return this.name.toString();
  }

  public getCategory(): string {
    return this.category.toString();
  }

  public getSlug(): string {
    return this.slug.toString();
  }

  public getLocation() {
    return this.location;
  }

  public getDescriptions() {
    return this.description;
  }

  public getContactDetails() {
    return this.contactDetails;
  }

  public getOfficialTagline(): string | null {
    return this.officialTagline;
  }

  public getOfficialSummary(): string | null {
    return this.officialSummary;
  }

  public getFlags() {
    return {
      isOwnerManaged: this.isOwnerManaged,
      isVerified: this.isVerified,
    };
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  private assertValidState(): void {
    if (!this.createdByUserId.trim()) {
      throw new PlaceConflictError("Place must have a creator.");
    }
    this.assertPublishableWhenNeeded();
  }

  private assertPublishable(): void {
    this.assertPublishableWhenNeeded();
  }

  private assertPublishableWhenNeeded(): void {
    if (this.publicationStatus !== "PUBLISHED") {
      return;
    }

    const { latitude, longitude, countryCode } = this.location;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !countryCode) {
      throw new PlaceConflictError("Published places must have a valid location.");
    }

    if (!this.name.toString() || !this.category.toString()) {
      throw new PlaceConflictError("Published places must have a valid name and category.");
    }
  }
}

function normalizeOptionalText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized || null;
}

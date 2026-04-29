// Server component — no 'use client' directive needed.
// Renders Schema.org structured data as inline JSON-LD.

export interface LocalBusinessSchema {
  type: 'LocalBusiness';
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  sameAs?: string[];
}

export interface AutoRepairSchema {
  type: 'AutoRepair';
  name: string;
  description?: string;
  url: string;
  telephone?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours?: string[];
  priceRange?: string;
  image?: string;
  hasOfferCatalog?: {
    name: string;
    itemListElement: Array<{
      name: string;
      description?: string;
      price?: string;
      priceCurrency?: string;
    }>;
  };
}

export interface ReviewSchema {
  type: 'Review';
  itemReviewed: { name: string; url?: string };
  reviewRating: { ratingValue: number; bestRating: number; worstRating?: number };
  reviewBody?: string;
  author: { name: string };
  datePublished?: string;
}

export interface AggregateRatingSchema {
  type: 'AggregateRating';
  itemReviewed: { name: string; url?: string };
  ratingValue: number;
  bestRating: number;
  worstRating?: number;
  reviewCount: number;
}

export interface FAQPageSchema {
  type: 'FAQPage';
  questions: Array<{ question: string; answer: string }>;
}

export type SchemaInput =
  | LocalBusinessSchema
  | AutoRepairSchema
  | ReviewSchema
  | AggregateRatingSchema
  | FAQPageSchema;

function buildLocalBusiness(s: LocalBusinessSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: s.name,
    description: s.description,
    url: s.url,
    telephone: s.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address.streetAddress,
      addressLocality: s.address.addressLocality,
      addressRegion: s.address.addressRegion,
      postalCode: s.address.postalCode,
      addressCountry: s.address.addressCountry,
    },
    ...(s.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: s.geo.latitude,
            longitude: s.geo.longitude,
          },
        }
      : {}),
    openingHours: s.openingHours,
    priceRange: s.priceRange,
    image: s.image,
    sameAs: s.sameAs,
  };
}

function buildAutoRepair(s: AutoRepairSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: s.name,
    description: s.description,
    url: s.url,
    telephone: s.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address.streetAddress,
      addressLocality: s.address.addressLocality,
      addressRegion: s.address.addressRegion,
      postalCode: s.address.postalCode,
      addressCountry: s.address.addressCountry,
    },
    openingHours: s.openingHours,
    priceRange: s.priceRange,
    image: s.image,
    ...(s.hasOfferCatalog
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: s.hasOfferCatalog.name,
            itemListElement: s.hasOfferCatalog.itemListElement.map((item) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: item.name,
                description: item.description,
              },
              price: item.price,
              priceCurrency: item.priceCurrency ?? 'USD',
            })),
          },
        }
      : {}),
  };
}

function buildReview(s: ReviewSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: s.itemReviewed.name,
      url: s.itemReviewed.url,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: s.reviewRating.ratingValue,
      bestRating: s.reviewRating.bestRating,
      worstRating: s.reviewRating.worstRating ?? 1,
    },
    reviewBody: s.reviewBody,
    author: { '@type': 'Person', name: s.author.name },
    datePublished: s.datePublished,
  };
}

function buildAggregateRating(s: AggregateRatingSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'LocalBusiness',
      name: s.itemReviewed.name,
      url: s.itemReviewed.url,
    },
    ratingValue: s.ratingValue,
    bestRating: s.bestRating,
    worstRating: s.worstRating ?? 1,
    reviewCount: s.reviewCount,
  };
}

function buildFAQPage(s: FAQPageSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

function toJsonLd(schema: SchemaInput): object {
  switch (schema.type) {
    case 'LocalBusiness':
      return buildLocalBusiness(schema);
    case 'AutoRepair':
      return buildAutoRepair(schema);
    case 'Review':
      return buildReview(schema);
    case 'AggregateRating':
      return buildAggregateRating(schema);
    case 'FAQPage':
      return buildFAQPage(schema);
  }
}

interface JsonLdProps {
  schemas: SchemaInput[];
}

/**
 * JsonLd — Server component.
 * Renders one <script type="application/ld+json"> per schema.
 * Pass multiple schemas to inject all at once.
 */
export default function JsonLd({ schemas }: JsonLdProps) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Safe: JSON.stringify escapes <, >, & — no XSS vector here
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(toJsonLd(schema), null, 0),
          }}
        />
      ))}
    </>
  );
}

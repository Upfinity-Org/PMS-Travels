import { SITE, absoluteUrl, hasAddress } from '../config/site';
import { fleet, type FleetCar } from '../content/fleet';
import type { Service } from '../content/services';

const BUSINESS_ID = `${SITE.url}/#business`;
const WEBSITE_ID = `${SITE.url}/#website`;

/** The business itself. Only fields you have actually filled in (src/config/site.ts) are emitted. */
export function businessSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': BUSINESS_ID,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: absoluteUrl('/'),
    logo: `${SITE.url}/icon-512.png`,
    image: `${SITE.url}/og-image.png`,
    description:
      'Local and outstation car, MPV, SUV and Tempo Traveller rentals with driver across Tamil Nadu and South India.',
    telephone: SITE.phone.tel,
    ...(SITE.email ? { email: SITE.email } : {}),
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    ...(hasAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(SITE.address.street ? { streetAddress: SITE.address.street } : {}),
            addressLocality: SITE.address.locality,
            addressRegion: SITE.address.region,
            ...(SITE.address.postalCode ? { postalCode: SITE.address.postalCode } : {}),
            addressCountry: SITE.address.country,
          },
        }
      : {}),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone.tel,
      contactType: 'reservations',
      areaServed: 'IN',
    },
    sameAs: [SITE.instagram.url],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vehicle rentals with driver',
      itemListElement: fleet.map((car) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: `${car.name} rental with driver`, url: absoluteUrl(`/fleet/${car.slug}`) },
      })),
    },
  };
}

export function websiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: SITE.name,
    inLanguage: SITE.locale,
    publisher: { '@id': BUSINESS_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(service: Service): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': BUSINESS_ID },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
  };
}

export function vehicleServiceSchema(car: FleetCar): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${car.name} rental with driver`,
    serviceType: 'Vehicle rental with driver',
    description: car.detail.metaDescription,
    url: absoluteUrl(`/fleet/${car.slug}`),
    provider: { '@id': BUSINESS_ID },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
  };
}

export function pageSchema(type: 'AboutPage' | 'ContactPage' | 'CollectionPage', name: string, path: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url: absoluteUrl(path),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
    inLanguage: SITE.locale,
  };
}

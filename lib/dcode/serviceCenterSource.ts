import type { Locale } from '@/i18n/routing';
import { prisma } from '@/lib/db';
import { serviceCenters, type ServiceCenter, type ServiceKind } from '@/content/serviceCenters';

// Loads after-sales service representatives DB-first, falling back to the bundled
// static array when no database is configured (the app runs without one). Mirrors the
// parent project's loader so the shared ServiceRepresentative table works as-is.

export type ServiceCenterFilters = {
  provinceId?: string;
  cityId?: string;
  serviceKind?: string;
};

export type NormalizedServiceCenterFilters = {
  provinceId?: string;
  cityId?: string;
  serviceKind?: ServiceKind;
};

export type ServiceCenterLocation = {
  id: string;
  label: string;
  cities: Array<{ id: string; label: string }>;
};

type ServiceRepresentativeRow = {
  id: string;
  provinceId: string;
  cityId: string;
  provinceNameFa: string;
  provinceNameEn: string;
  cityNameFa: string;
  cityNameEn: string;
  serviceKind: string;
  representativeNameFa: string;
  representativeNameEn: string;
  representativeCode: string;
  primaryPhone: string;
  mobilePhone: string;
  addressFa: string;
  addressEn: string;
};

type PrismaServiceRepresentativeClient = {
  serviceRepresentative: {
    findMany(args: {
      orderBy: Array<{ sortOrder: 'asc' }>;
      select: Record<keyof ServiceRepresentativeRow, true>;
    }): Promise<ServiceRepresentativeRow[]>;
  };
};

const SERVICE_KINDS = new Set<ServiceKind>(['tv', 'ha', 'rac', 'cac', 'vrf']);

function getServiceRepresentativeClient(): PrismaServiceRepresentativeClient | null {
  if (!prisma) {
    return null;
  }
  return prisma;
}

function isServiceKind(value: string | undefined): value is ServiceKind {
  return Boolean(value && SERVICE_KINDS.has(value as ServiceKind));
}

function emptyToUndefined(value: string | undefined) {
  return value ? value : undefined;
}

export function normalizeServiceCenterFilters(
  filters: ServiceCenterFilters,
): NormalizedServiceCenterFilters {
  return {
    provinceId: emptyToUndefined(filters.provinceId),
    cityId: emptyToUndefined(filters.cityId),
    serviceKind: isServiceKind(filters.serviceKind) ? filters.serviceKind : undefined,
  };
}

function toServiceCenter(row: ServiceRepresentativeRow): ServiceCenter {
  return {
    id: row.id,
    provinceId: row.provinceId,
    cityId: row.cityId,
    provinceName: { fa: row.provinceNameFa, en: row.provinceNameEn },
    cityName: { fa: row.cityNameFa, en: row.cityNameEn },
    serviceKind: isServiceKind(row.serviceKind) ? row.serviceKind : 'tv',
    representativeName: { fa: row.representativeNameFa, en: row.representativeNameEn },
    representativeCode: row.representativeCode,
    primaryPhone: row.primaryPhone,
    mobilePhone: row.mobilePhone,
    address: { fa: row.addressFa, en: row.addressEn },
  };
}

function serviceCenterSelect(): Record<keyof ServiceRepresentativeRow, true> {
  return {
    id: true,
    provinceId: true,
    cityId: true,
    provinceNameFa: true,
    provinceNameEn: true,
    cityNameFa: true,
    cityNameEn: true,
    serviceKind: true,
    representativeNameFa: true,
    representativeNameEn: true,
    representativeCode: true,
    primaryPhone: true,
    mobilePhone: true,
    addressFa: true,
    addressEn: true,
  };
}

function applyFilters(
  centers: ServiceCenter[],
  filters: NormalizedServiceCenterFilters,
): ServiceCenter[] {
  return centers.filter((center) => {
    if (filters.provinceId && center.provinceId !== filters.provinceId) return false;
    if (filters.cityId && center.cityId !== filters.cityId) return false;
    if (filters.serviceKind && center.serviceKind !== filters.serviceKind) return false;
    return true;
  });
}

function sortServiceCenters(locale: Locale, centers: ServiceCenter[]) {
  return [...centers].sort((a, b) => {
    const province = a.provinceName[locale].localeCompare(b.provinceName[locale], locale);
    if (province !== 0) return province;
    const city = a.cityName[locale].localeCompare(b.cityName[locale], locale);
    if (city !== 0) return city;
    const kind = a.serviceKind.localeCompare(b.serviceKind);
    if (kind !== 0) return kind;
    return a.representativeName[locale].localeCompare(b.representativeName[locale], locale);
  });
}

export function getServiceCenterLocations(
  locale: Locale,
  centers: ServiceCenter[],
): ServiceCenterLocation[] {
  const locationMap = new Map<
    string,
    { id: string; label: string; cityMap: Map<string, { id: string; label: string }> }
  >();

  centers.forEach((center) => {
    if (!locationMap.has(center.provinceId)) {
      locationMap.set(center.provinceId, {
        id: center.provinceId,
        label: center.provinceName[locale],
        cityMap: new Map(),
      });
    }
    locationMap.get(center.provinceId)?.cityMap.set(center.cityId, {
      id: center.cityId,
      label: center.cityName[locale],
    });
  });

  return Array.from(locationMap.values())
    .map((location) => ({
      id: location.id,
      label: location.label,
      cities: Array.from(location.cityMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label, locale),
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

export async function loadServiceCenterData(
  locale: Locale,
  filters: ServiceCenterFilters,
  includeCenters = true,
): Promise<{
  centers: ServiceCenter[];
  locations: ServiceCenterLocation[];
  totalCount: number;
  source: 'database' | 'fallback';
}> {
  const client = getServiceRepresentativeClient();
  const normalizedFilters = normalizeServiceCenterFilters(filters);

  if (client) {
    try {
      const allRows = await client.serviceRepresentative.findMany({
        orderBy: [{ sortOrder: 'asc' }],
        select: serviceCenterSelect(),
      });

      if (allRows.length > 0) {
        const allCenters = sortServiceCenters(locale, allRows.map(toServiceCenter));
        return {
          centers: includeCenters ? applyFilters(allCenters, normalizedFilters) : [],
          locations: getServiceCenterLocations(locale, allCenters),
          totalCount: allRows.length,
          source: 'database',
        };
      }
    } catch (error) {
      console.error('[service-centers] database fetch failed', error);
    }
  }

  return {
    centers: includeCenters
      ? sortServiceCenters(locale, applyFilters(serviceCenters, normalizedFilters))
      : [],
    locations: getServiceCenterLocations(locale, serviceCenters),
    totalCount: serviceCenters.length,
    source: 'fallback',
  };
}

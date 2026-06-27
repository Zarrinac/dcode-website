import type { Locale } from '@/i18n/routing';

// Service-representative content model — mirrors the parent Hisense/Zarrin project so
// a DB dump of the shared after-sales network loads unchanged. D'code products are
// serviced by the same authorized centres. The DB is the source of truth (see
// lib/dcode/serviceCenterSource.ts); this static array is the DB-less fallback and
// ships empty — real rows arrive from the seeded/imported ServiceRepresentative table.
export type ServiceKind = 'tv' | 'ha' | 'rac' | 'cac' | 'vrf';

export type LocalizedText = Record<Locale, string>;

export type ServiceCenter = {
  id: string;
  provinceId: string;
  cityId: string;
  provinceName: LocalizedText;
  cityName: LocalizedText;
  serviceKind: ServiceKind;
  representativeName: LocalizedText;
  representativeCode: string;
  primaryPhone: string;
  mobilePhone: string;
  address: LocalizedText;
};

export const serviceKindLabels: Record<ServiceKind, LocalizedText> = {
  tv: { fa: 'تلویزیون (TV)', en: 'Television (TV)' },
  ha: { fa: 'لوازم خانگی (HA)', en: 'Home appliances (HA)' },
  rac: { fa: 'کولر گازی خانگی (RAC)', en: 'Residential air conditioner (RAC)' },
  cac: { fa: 'کولر گازی صنعتی (CAC)', en: 'Commercial air conditioner (CAC)' },
  vrf: { fa: 'کولر گازی صنعتی (VRF)', en: 'Commercial air conditioner (VRF)' },
};

// DB-less fallback. Populate the ServiceRepresentative table (DB dump / seed) to
// drive the live finder; until then the table renders its empty/ready state.
export const serviceCenters: ServiceCenter[] = [];

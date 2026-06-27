'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/routing';
import { serviceKindLabels, type ServiceCenter, type ServiceKind } from '@/content/serviceCenters';

// Filterable service-representative table for /service-centers, themed for the D'code
// dark palette. The form submits via GET (hidden `submitted=1`) so the bare canonical
// page stays light and the result rows are rendered server-side on submit.
type LocationOption = {
  id: string;
  label: string;
  cities: Array<{ id: string; label: string }>;
};

export type ServiceCenterFinderCopy = {
  provinceLabel: string;
  cityLabel: string;
  serviceKindLabel: string;
  allCities: string;
  allServiceKinds: string;
  provincePlaceholder: string;
  cityPlaceholder: string;
  serviceKindPlaceholder: string;
  submitLabel: string;
  resetLabel: string;
  resultCount: string;
  emptyTitle: string;
  emptyDescription: string;
  noDataTitle: string;
  noDataDescription: string;
  initialTitle: string;
  initialDescription: string;
  headers: {
    province: string;
    city: string;
    serviceKind: string;
    representativeName: string;
    representativeCode: string;
    primaryPhone: string;
    mobilePhone: string;
    address: string;
  };
};

type ServiceCenterFinderProps = {
  locale: Locale;
  centers: ServiceCenter[];
  locations: LocationOption[];
  copy: ServiceCenterFinderCopy;
  selectedFilters: { provinceId?: string; cityId?: string; serviceKind?: ServiceKind };
  hasSearched: boolean;
  totalCount: number;
};

// D'code only sells TVs and residential air conditioners, so the filter offers just
// those two service types (the shared rep table may still carry other kinds).
const SERVICE_KIND_ORDER: ServiceKind[] = ['tv', 'rac'];

function formatCount(template: string, count: number, locale: Locale) {
  const numberLocale = locale === 'fa' ? 'fa-IR' : 'en-US';
  return template.replace('{count}', new Intl.NumberFormat(numberLocale).format(count));
}

const selectClass =
  'min-h-12 w-full rounded-lg border border-(--dcode-border) bg-(--dcode-surface-muted) px-3 py-2 text-(--dcode-text) outline-none transition focus:border-(--dcode-red) disabled:cursor-not-allowed disabled:opacity-60';

export default function ServiceCenterFinder({
  locale,
  centers,
  locations,
  copy,
  selectedFilters,
  hasSearched,
  totalCount,
}: ServiceCenterFinderProps) {
  const [draftProvinceId, setDraftProvinceId] = useState(selectedFilters.provinceId ?? '');
  const [draftCityId, setDraftCityId] = useState(selectedFilters.cityId ?? '');
  const [draftServiceKind, setDraftServiceKind] = useState<ServiceKind | ''>(
    selectedFilters.serviceKind ?? '',
  );

  const cityOptions = useMemo(
    () => locations.find((location) => location.id === draftProvinceId)?.cities ?? [],
    [draftProvinceId, locations],
  );

  const hasAnyCenters = totalCount > 0;

  return (
    <div className="rounded-2xl border border-(--dcode-border) bg-(--dcode-surface) p-5 sm:p-6">
      <form method="get" className="grid gap-4 sm:grid-cols-3">
        <input type="hidden" name="submitted" value="1" />
        <label className="grid gap-2 text-sm font-medium text-(--dcode-text)">
          <span>{copy.provinceLabel}</span>
          <select
            name="province"
            value={draftProvinceId}
            onChange={(event) => {
              setDraftProvinceId(event.target.value);
              setDraftCityId('');
            }}
            className={selectClass}
          >
            <option value="">{copy.provincePlaceholder}</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-(--dcode-text)">
          <span>{copy.cityLabel}</span>
          <select
            name="city"
            value={draftCityId}
            onChange={(event) => setDraftCityId(event.target.value)}
            disabled={!draftProvinceId}
            className={selectClass}
          >
            <option value="">{draftProvinceId ? copy.allCities : copy.cityPlaceholder}</option>
            {cityOptions.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-(--dcode-text)">
          <span>{copy.serviceKindLabel}</span>
          <select
            name="service"
            value={draftServiceKind}
            onChange={(event) => setDraftServiceKind(event.target.value as ServiceKind | '')}
            className={selectClass}
          >
            <option value="">{copy.allServiceKinds}</option>
            {SERVICE_KIND_ORDER.map((kind) => (
              <option key={kind} value={kind}>
                {serviceKindLabels[kind][locale]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-1 sm:col-span-3">
          <button
            type="submit"
            className="rounded-full bg-(--dcode-red) px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--dcode-red-hover)"
          >
            {copy.submitLabel}
          </button>
          <a
            href="?"
            className="rounded-full border border-(--dcode-border) px-5 py-2.5 text-sm font-semibold text-(--dcode-text-muted) transition-colors hover:border-(--dcode-red) hover:text-(--dcode-red)"
          >
            {copy.resetLabel}
          </a>
        </div>
      </form>

      {hasSearched && (
        <p className="mt-6 text-sm text-(--dcode-text-muted)">
          {formatCount(copy.resultCount, centers.length, locale)}
        </p>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-248 border-collapse text-center text-sm">
          <thead>
            <tr className="bg-(--dcode-red) text-white">
              {Object.values(copy.headers).map((header) => (
                <th key={header} className="border border-white/20 px-3 py-3.5 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasSearched &&
              centers.map((center) => (
                <tr
                  key={center.id}
                  className="odd:bg-(--dcode-surface) even:bg-(--dcode-surface-muted)"
                >
                  <td className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text-muted)">
                    {center.provinceName[locale]}
                  </td>
                  <td className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text-muted)">
                    {center.cityName[locale]}
                  </td>
                  <td className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text-muted)">
                    {serviceKindLabels[center.serviceKind][locale]}
                  </td>
                  <td className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text)">
                    {center.representativeName[locale]}
                  </td>
                  <td
                    className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text-muted)"
                    dir="ltr"
                  >
                    {center.representativeCode}
                  </td>
                  <td
                    className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text-muted)"
                    dir="ltr"
                  >
                    {center.primaryPhone}
                  </td>
                  <td
                    className="border border-(--dcode-border) px-3 py-3.5 text-(--dcode-text-muted)"
                    dir="ltr"
                  >
                    {center.mobilePhone}
                  </td>
                  <td className="border border-(--dcode-border) px-3 py-3.5 leading-7 text-(--dcode-text-muted)">
                    {center.address[locale]}
                  </td>
                </tr>
              ))}
            {(!hasSearched || centers.length === 0) && (
              <tr>
                <td colSpan={8} className="border border-(--dcode-border) px-4 py-10 text-center">
                  <p className="text-base font-bold text-(--dcode-text)">
                    {!hasSearched
                      ? copy.initialTitle
                      : hasAnyCenters
                        ? copy.emptyTitle
                        : copy.noDataTitle}
                  </p>
                  <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-(--dcode-text-muted)">
                    {!hasSearched
                      ? copy.initialDescription
                      : hasAnyCenters
                        ? copy.emptyDescription
                        : copy.noDataDescription}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

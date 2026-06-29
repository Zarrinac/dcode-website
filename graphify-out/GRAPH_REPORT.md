# Graph Report - . (2026-06-29)

## Corpus Check

- 87 files · ~132,093 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 686 nodes · 1129 edges · 42 communities (33 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.8)
- Token cost: 62,429 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Page Metadata & SEO Helpers|Page Metadata & SEO Helpers]]
- [[_COMMUNITY_Site Shell & Navigation|Site Shell & Navigation]]
- [[_COMMUNITY_Product Data Layer|Product Data Layer]]
- [[_COMMUNITY_Product Page Components|Product Page Components]]
- [[_COMMUNITY_English Messages (en.json)|English Messages (en.json)]]
- [[_COMMUNITY_Service Center Finder|Service Center Finder]]
- [[_COMMUNITY_Brand, Media & Keywords|Brand, Media & Keywords]]
- [[_COMMUNITY_Landing Page Copy|Landing Page Copy]]
- [[_COMMUNITY_Landing Page Copy (other locale)|Landing Page Copy (other locale)]]
- [[_COMMUNITY_Server Deploy & Ops|Server Deploy & Ops]]
- [[_COMMUNITY_Dev Dependencies & Tooling|Dev Dependencies & Tooling]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Animated Hero (Depth Grid)|Animated Hero (Depth Grid)]]
- [[_COMMUNITY_HeaderFooter Shell Copy|Header/Footer Shell Copy]]
- [[_COMMUNITY_Media Optimization Script|Media Optimization Script]]
- [[_COMMUNITY_npm Scripts|npm Scripts]]
- [[_COMMUNITY_Product Cards & Gallery|Product Cards & Gallery]]
- [[_COMMUNITY_Detail Label Translations|Detail Label Translations]]
- [[_COMMUNITY_D'code Seed Script|D'code Seed Script]]
- [[_COMMUNITY_SEO Strategy (docs)|SEO Strategy (docs)]]
- [[_COMMUNITY_Runtime Dependencies|Runtime Dependencies]]
- [[_COMMUNITY_Persian AC Copy (fa.json)|Persian AC Copy (fa.json)]]
- [[_COMMUNITY_TV List Copy|TV List Copy]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Root Layout & Analytics|Root Layout & Analytics]]
- [[_COMMUNITY_Landing & Routing (docs)|Landing & Routing (docs)]]
- [[_COMMUNITY_Monitor Cron Script|Monitor Cron Script]]
- [[_COMMUNITY_Deploy Script Internals|Deploy Script Internals]]
- [[_COMMUNITY_CTA Link Component|CTA Link Component]]
- [[_COMMUNITY_Project Overview (docs)|Project Overview (docs)]]
- [[_COMMUNITY_Analytics & Verification Config|Analytics & Verification Config]]
- [[_COMMUNITY_Parallax Image Component|Parallax Image Component]]
- [[_COMMUNITY_Apache TLS  SELinux|Apache TLS / SELinux]]
- [[_COMMUNITY_Weekly Backup Script|Weekly Backup Script]]
- [[_COMMUNITY_Media Sync Script|Media Sync Script]]
- [[_COMMUNITY_Media UploadSync Ops|Media Upload/Sync Ops]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Tailwind v4 Setup|Tailwind v4 Setup]]
- [[_COMMUNITY_Backup Cron Job|Backup Cron Job]]

## God Nodes (most connected - your core abstractions)

1. `Locale` - 33 edges
2. `landing` - 29 edges
3. `landing` - 29 edges
4. `getLanguageAlternates()` - 25 edges
5. `createBreadcrumbItems()` - 22 edges
6. `createBreadcrumbJsonLd()` - 21 edges
7. `SITE_URL` - 17 edges
8. `compilerOptions` - 16 edges
9. `toAbsoluteUrl()` - 14 edges
10. `Shell` - 14 edges

## Surprising Connections (you probably didn't know these)

- `Keywords as targeting map (not meta ranking)` --semantically_similar_to--> `Primary Objective: SEO` [INFERRED] [semantically similar]
  seo/keywords.txt → CLAUDE.md
- `generateMetadata()` --calls--> `getLanguageAlternates()` [INFERRED]
  app/[locale]/air-conditioners/[productId]/page.tsx → lib/seo/site.ts
- `DcodeAcDetailPage()` --calls--> `categoryHref()` [INFERRED]
  app/[locale]/air-conditioners/[productId]/page.tsx → lib/dcode/categories.ts
- `DcodeAcDetailPage()` --calls--> `productHref()` [INFERRED]
  app/[locale]/air-conditioners/[productId]/page.tsx → lib/dcode/categories.ts
- `DcodeAcDetailPage()` --calls--> `buildProductPageJsonLd()` [INFERRED]
  app/[locale]/air-conditioners/[productId]/page.tsx → lib/dcode/jsonld.ts

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **SEO infrastructure** — claude_generate_metadata, lib_dcode_jsonld, components_seo_structureddata, lib_seo_site, app_sitemap, app_robots, lib_seo_keywords [EXTRACTED 0.85]
- **Deploy pipeline** — ops_deploy_sh, ops_preflight, ops_ecosystem_config, ops_public_media_symlink, ops_nvm_pm2 [EXTRACTED 0.85]
- **i18n localization** — claude_localization, i18n_routing, claude_rtl_layout, claude_withnextintl, claude_no_middleware [EXTRACTED 0.85]

## Communities (42 total, 9 thin omitted)

### Community 0 - "Page Metadata & SEO Helpers"

Cohesion: 0.05
Nodes (81): AboutContent, AboutPage(), Block, CONTENT, generateMetadata(), PageParams, PageProps, resolveLocale() (+73 more)

### Community 1 - "Site Shell & Navigation"

Cohesion: 0.06
Nodes (46): next-intl localization (fa/en), No middleware.ts (plugin-handled i18n), RTL layout for Persian (fa), withNextIntl() plugin wrapper, CONTENT, generateMetadata(), PageParams, PageProps (+38 more)

### Community 2 - "Product Data Layer"

Cohesion: 0.05
Nodes (41): DB-first → static fallback, components/dcode/ProductDetailView.tsx, components/dcode/ProductListView.tsx, acIndoor1, acIndoor2, acIndoor3, acOutdoor1, acOutdoor2 (+33 more)

### Community 3 - "Product Page Components"

Cohesion: 0.08
Nodes (22): productImageAlt(), DcodeSectionProps, ProductDetailViewProps, ProductListViewProps, DcodeShowcaseLabels, ProductShowcase(), ProductShowcaseProps, SectionHeadingProps (+14 more)

### Community 4 - "English Messages (en.json)"

Cohesion: 0.05
Nodes (41): eyebrow, metaDescription, metaTitle, tagline, title, viewProduct, DcodePage, ac (+33 more)

### Community 5 - "Service Center Finder"

Cohesion: 0.08
Nodes (36): LocalizedText, ServiceCenter, serviceCenters, ServiceKind, serviceKindLabels, applyFilters(), emptyToUndefined(), getServiceCenterLocations() (+28 more)

### Community 6 - "Brand, Media & Keywords"

Cohesion: 0.09
Nodes (20): Brand red #E40614 sampled from logo, dcodeAsset() media reference helper, components/dcode/dcodeTheme.ts, DCODE_BRAND, dcodeAsset(), dcodeLogoAsset(), DcodeLogoProps, NEXT_PUBLIC_MEDIA_BASE_URL env var (+12 more)

### Community 7 - "Landing Page Copy"

Cohesion: 0.07
Nodes (29): landing, acCardDescription, acCardEyebrow, acCardTitle, ctaDescription, ctaTitle, exploreCta, familiesDescription (+21 more)

### Community 8 - "Landing Page Copy (other locale)"

Cohesion: 0.07
Nodes (29): landing, acCardDescription, acCardEyebrow, acCardTitle, ctaDescription, ctaTitle, exploreCta, familiesDescription (+21 more)

### Community 9 - "Server Deploy & Ops"

Cohesion: 0.08
Nodes (22): NEXT_PUBLIC_SITE_URL env var, ops/cron/dcode-monitor.sh, DcodeSite openSUSE host (172.17.0.20), ops/deploy.sh (deploy pipeline), Deploy workflow (main-only, pull-only), ecosystem.config.cjs (PM2 config), firewalld (http/https/ssh), Node via nvm + PM2 process manager (+14 more)

### Community 10 - "Dev Dependencies & Tooling"

Cohesion: 0.08
Nodes (26): devDependencies, autoprefixer, dotenv, eslint, eslint-config-next, eslint-plugin-react, eslint-plugin-unused-imports, globals (+18 more)

### Community 11 - "TypeScript Config"

Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 12 - "Animated Hero (Depth Grid)"

Cohesion: 0.15
Nodes (11): DCODE_THEME_STYLE, GRID, RING_SCALES, VB, EASE, HeadlineReveal(), headlineStagger, heroContainer (+3 more)

### Community 13 - "Header/Footer Shell Copy"

Cohesion: 0.14
Nodes (14): Shell, airConditioners, closeMenu, footerProducts, footerRights, footerSitemap, footerTagline, home (+6 more)

### Community 14 - "Media Optimization Script"

Cohesion: 0.18
Nodes (12): Media not committed to git workflow, ALSO_WEBP, COPY_AS_IS, \_\_dirname, MEDIA_ROOT, optimizeRaster(), RASTER, ROOT (+4 more)

### Community 15 - "npm Scripts"

Cohesion: 0.15
Nodes (13): scripts, build, db:deploy, db:migrate, db:seed, db:seed:dcode, dev, format (+5 more)

### Community 16 - "Product Cards & Gallery"

Cohesion: 0.21
Nodes (5): GalleryProps, ProductCardProps, ProductFamilyCardProps, ImageSource, Locale

### Community 17 - "Detail Label Translations"

Cohesion: 0.17
Nodes (12): detail, close, dimensionsWithoutStand, dimensionsWithStand, gallery, highlights, keyFeatures, model (+4 more)

### Community 18 - "D'code Seed Script"

Cohesion: 0.23
Nodes (11): adapter, asString(), envFiles, loadDcodeProducts(), ModuleInternals, pool, prisma, registerModuleStubs() (+3 more)

### Community 19 - "SEO Strategy (docs)"

Cohesion: 0.20
Nodes (11): Per-page generateMetadata, ISR revalidate = 3600, No price-less Product/Offer JSON-LD, Primary Objective: SEO, Two product families (TVs + ACs), components/seo/StructuredData.tsx, lib/dcode/categories.ts (section slugs), lib/seo/keywords.ts (keyword reader) (+3 more)

### Community 20 - "Runtime Dependencies"

Cohesion: 0.18
Nodes (11): dependencies, framer-motion, next, next-intl, pg, @prisma/adapter-pg, @prisma/client, react (+3 more)

### Community 21 - "Persian AC Copy (fa.json)"

Cohesion: 0.22
Nodes (8): eyebrow, metaDescription, metaTitle, tagline, title, viewProduct, DcodePage, ac

### Community 22 - "TV List Copy"

Cohesion: 0.29
Nodes (7): tvs, eyebrow, metaDescription, metaTitle, tagline, title, viewProduct

### Community 23 - "Next.js Config"

Cohesion: 0.29
Nodes (6): nextConfig, PARENT_FORM_REDIRECTS, RemotePattern, remotePatterns, securityHeaders, withNextIntl

### Community 24 - "Package Manifest"

Cohesion: 0.33
Nodes (5): lint-staged, \*.{js,jsx}, name, private, version

### Community 26 - "Landing & Routing (docs)"

Cohesion: 0.50
Nodes (4): app/[locale]/page.tsx (brand landing), Locale-prefixed App Router routing, components/dcode/heroes/HeroDepthGrid.tsx, components/shell/ (header + footer shell)

### Community 27 - "Monitor Cron Script"

Cohesion: 0.50
Nodes (3): dcode-monitor.sh script, HOME, NVM_DIR

### Community 28 - "Deploy Script Internals"

Cohesion: 0.67
Nodes (3): deploy.sh script, log(), NVM_DIR

### Community 30 - "Project Overview (docs)"

Cohesion: 0.67
Nodes (3): Dev server on port 3002, Extraction from zarrinac-website repo, D'code Website Project

### Community 31 - "Analytics & Verification Config"

Cohesion: 0.67
Nodes (3): Analytics component (gtag injector), NEXT_PUBLIC_GA_ID env var, GA4 + Search Console (DNS TXT) config

### Community 33 - "Apache TLS / SELinux"

Cohesion: 0.67
Nodes (3): Apache reverse proxy + TLS termination, SELinux httpd_can_network_connect, Manual Certum DV TLS cert

## Knowledge Gaps

- **364 isolated node(s):** `PageParams`, `PageProps`, `Block`, `Stat`, `AboutContent` (+359 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `Site Shell & Navigation` to `Page Metadata & SEO Helpers`, `Product Page Components`, `Service Center Finder`, `Brand, Media & Keywords`, `Animated Hero (Depth Grid)`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `DATABASE_URL env var` connect `Product Data Layer` to `Server Deploy & Ops`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `getLanguageAlternates()` (e.g. with `generateMetadata()` and `generateMetadata()`) actually correct?**
  _`getLanguageAlternates()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PageParams`, `PageProps`, `Block` to the rest of the system?**
  _380 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Page Metadata & SEO Helpers` be split into smaller, more focused modules?**
  _Cohesion score 0.050284031138228484 - nodes in this community are weakly interconnected._
- **Should `Site Shell & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.05625 - nodes in this community are weakly interconnected._
- **Should `Product Data Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.051418439716312055 - nodes in this community are weakly interconnected._

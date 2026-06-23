import { type DcodeProduct } from '@/types/dcode';
import { dcodeAsset } from '@/lib/dcode/brand';

// Bundled fallback catalog for the D'code brand, used when a database is not
// available. Data extracted from the official D'code catalogues:
//   • LED TVs — public/dcode/led/r6d-files/Dcode-LED-TV.pdf
//   • Air conditioners — public/dcode/ac/D'CODE-dtec30.pdf
// D'code ships two families today: the R6D LED TV line (three sizes) and the
// DTEC30 cooling-only split air conditioner (30,000 BTU).

// ── R6D LED TV assets — each size ships a front (A) and angled (B) render. ──
const r6d55Image = dcodeAsset('led/r6d-files/DCODE-55-A.png');
const r6d55ImageB = dcodeAsset('led/r6d-files/DCODE-55-B.png');
const r6d65Image = dcodeAsset('led/r6d-files/DCODE-65-A.png');
const r6d65ImageB = dcodeAsset('led/r6d-files/DCODE-65-B.png');
const r6d75Image = dcodeAsset('led/r6d-files/DCODE-75-A.png');
const r6d75ImageB = dcodeAsset('led/r6d-files/DCODE-75-B.png');
const r6dRemoteImage = dcodeAsset('led/r6d-files/DCode-Remote.png');
const r6dVideo = dcodeAsset('led/r6d-files/DCODE-LED.mp4');

// Feature icons (white assets for the dark D'code theme).
const iconShareToTv = dcodeAsset('icons/share-to-tv.png');
const iconVoiceControl = dcodeAsset('icons/voice-control.png');
const iconHdr10 = dcodeAsset('icons/hdr10.png');

// ── DTEC30 air-conditioner assets. ──
const acIndoor1 = dcodeAsset('ac/dtec30-indoor-1.png');
const acIndoor2 = dcodeAsset('ac/dtec30-indoor-2.png');
const acIndoor3 = dcodeAsset('ac/dtec30-indoor-3.png');
const acOutdoor1 = dcodeAsset('ac/dtec30-outdoor-1.png');
const acOutdoor2 = dcodeAsset('ac/dtec30-outdoor-2.png');
const acRemote = dcodeAsset('ac/dtec30-remote.png');

export const DCODE_PRODUCTS: DcodeProduct[] = [
  {
    id: 'r6d',
    brand: 'dcode',
    category: 'tv',
    series: 'R6D',
    warrantyMonths: 24,
    heroImage: r6d75Image,
    heroVideo: r6dVideo,
    remoteImage: r6dRemoteImage,
    // Angled lifestyle shots only — the straight-on (A) renders already appear in
    // the hero / size selector, so the gallery shows the distinct angled scenes.
    gallery: [r6d55ImageB, r6d65ImageB, r6d75ImageB],
    remotes: {
      en: ['Standard IR remote control', 'Bluetooth Air Mouse remote control'],
      fa: ['ریموت کنترل نرمال (IR)', 'ریموت کنترل بلوتوثی (Air Mouse)'],
    },
    extras: [
      'Android 11 Smart TV',
      '4K UHD',
      '32GB internal storage',
      'Dual remote (IR + Bluetooth Air Mouse)',
      'High-End Frame and Stand',
    ],
    variants: [
      {
        sku: 'R6D55KE8050UW',
        size: '55"',
        diagonalInch: 55,
        image: r6d55Image,
        dimensionsWithoutStand: '1230 × 77 × 719 mm',
        dimensionsWithStand: '1230 × 257 × 795 mm',
        netWeight: '12.5 kg',
      },
      {
        sku: 'R6D65KE8050UW',
        size: '65"',
        diagonalInch: 65,
        image: r6d65Image,
        dimensionsWithoutStand: '1450 × 77 × 842 mm',
        dimensionsWithStand: '1450 × 290 × 890 mm',
        netWeight: '19 kg',
      },
      {
        sku: 'R6D75KE8050UW',
        size: '75"',
        diagonalInch: 75,
        image: r6d75Image,
        dimensionsWithoutStand: '1670 × 84 × 960 mm',
        dimensionsWithStand: '1670 × 363 × 1030 mm',
        netWeight: '27.5 kg',
      },
    ],
    featureCards: [
      {
        title: { en: '4K UHD · Android 11', fa: '4K UHD · اندروید ۱۱' },
        description: {
          en: 'Sharp 8MP 4K picture on the Android 11 smart platform with a wide app library.',
          fa: 'تصویر شفاف هشت مگاپیکسلی 4K روی پلتفرم هوشمند اندروید ۱۱ با کتابخانه‌ی گسترده‌ی اپلیکیشن‌ها.',
        },
      },
      {
        title: { en: 'Share to TV', fa: 'اشتراک‌گذاری با تلویزیون' },
        description: {
          en: 'Mirror your phone to the TV over miracast / e-share.',
          fa: 'انعکاس تصویر گوشی روی تلویزیون با miracast / e-share.',
        },
        icon: iconShareToTv,
      },
      {
        title: { en: 'HDR10', fa: 'HDR10' },
        description: {
          en: 'High dynamic range for deeper contrast and richer 4K colour.',
          fa: 'محدوده‌ی دینامیکی بالا برای کنتراست عمیق‌تر و رنگ‌های غنی‌تر 4K.',
        },
        icon: iconHdr10,
      },
      {
        title: { en: 'Voice Control', fa: 'کنترل صوتی' },
        description: {
          en: 'Hands-free voice search and control on the Android 11 platform.',
          fa: 'جستجو و کنترل صوتی روی پلتفرم اندروید ۱۱.',
        },
        icon: iconVoiceControl,
      },
      {
        title: { en: 'High-End Frame and Stand', fa: 'بدنه و پایه‌ی High-End' },
        description: {
          en: 'A premium slim frame and metal stand for a refined look in any room.',
          fa: 'قاب باریک و پایه‌ی فلزی پریمیوم برای ظاهری شکیل در هر فضایی.',
        },
      },
    ],
    attributes: [
      {
        label: { en: 'Panel', fa: 'پنل' },
        value: { en: '4K UHD LED', fa: '4K UHD LED' },
      },
      {
        label: { en: 'Resolution', fa: 'رزولوشن' },
        value: { en: '3840 × 2160 (4K UHD)', fa: '۳۸۴۰ × ۲۱۶۰ (4K UHD)' },
      },
      {
        label: { en: 'Operating system', fa: 'سیستم‌عامل' },
        value: { en: 'Android 11', fa: 'اندروید ۱۱' },
      },
      {
        label: { en: 'Internal storage', fa: 'حافظه‌ی داخلی' },
        value: { en: '32GB', fa: '۳۲ گیگابایت' },
      },
      {
        label: { en: 'Viewing angle', fa: 'زاویه‌ی دید' },
        value: { en: '178°', fa: '۱۷۸ درجه' },
      },
      {
        label: { en: 'Tuner', fa: 'تیونر' },
        value: {
          en: 'Built-in DVB-T/T2, Time Shift',
          fa: 'دیجیتال داخلی DVB-T/T2، تایم‌شیفت',
        },
      },
      {
        label: { en: 'Sound output', fa: 'خروجی صدا' },
        value: { en: 'Headphone & Optical (SPDIF)', fa: 'هدفون و اپتیکال (SPDIF)' },
      },
      {
        label: { en: 'Connectivity', fa: 'درگاه‌ها و اتصال' },
        value: {
          en: 'WiFi · Bluetooth · HDMI ×3 · USB 2.0 ×2 · Component · AV',
          fa: 'وای‌فای · بلوتوث · سه HDMI · دو USB 2.0 · کامپوننت · AV',
        },
      },
      {
        label: { en: 'Screen mirroring', fa: 'اشتراک تصویر گوشی' },
        value: { en: 'miracast / e-share', fa: 'miracast / e-share' },
      },
      {
        label: { en: 'Warranty', fa: 'گارانتی' },
        value: { en: '24 months', fa: '۲۴ ماه' },
      },
    ],
    specs: {
      en: [
        'Smart TV',
        'Android 11 operating system',
        'High-clarity, sharp picture',
        '8MP 4K picture',
        '3840 × 2160 resolution',
        '178° viewing angle',
        '32GB internal storage',
        'TV program recording',
        'Time Shift support',
        'UHD technology',
        'Built-in digital tuner',
        'WiFi and Bluetooth connectivity',
        'Phone connectivity (miracast / e-share)',
        'Built-in DVB-T/T2 digital tuner',
        'Headphone and Optical output',
        'Component, AV, USB 2.0 x2, HDMI x3',
        '24-month warranty',
        'Two remote controls (standard IR + Bluetooth Air Mouse)',
      ],
      fa: [
        'تلویزیون هوشمند Smart',
        'دارای سیستم عامل Android 11',
        'وضوح تصویر بالا و شفاف',
        'تصویر هشت مگا پیکسل 4K',
        'رزولوشن ۳۸۴۰ × ۲۱۶۰',
        'زاویه دید ۱۷۸ درجه',
        'دارای ۳۲ گیگابایت حافظه‌ی داخلی',
        'قابلیت ضبط برنامه‌های تلویزیونی',
        'مجهز به Time Shift',
        'مجهز به فناوری UHD',
        'گیرنده‌ی دیجیتال داخلی',
        'قابلیت اتصال به WIFI و Bluetooth',
        'قابلیت اتصال به گوشی (miracast / e-share)',
        'تیونر دیجیتال داخلی DVB-T/T2',
        'خروجی هدفون و Optical',
        'Component، AV، دو درگاه USB 2.0 و سه درگاه HDMI',
        '۲۴ ماه ضمانت',
        'دو ریموت کنترل (نرمال IR و بلوتوثی Air Mouse)',
      ],
    },
    copy: {
      en: {
        name: "D'code R6D 4K Smart LED TV",
        tagline: '4K UHD Android 11 smart TV in 55, 65, and 75 inches.',
        description:
          "D'code's R6D LED line pairs a sharp 4K UHD panel with the Android 11 smart platform, 32GB of storage, and dual remotes — all wrapped in a high-end slim frame and metal stand.",
        highlights: [
          '4K UHD (3840 × 2160) LED panel with 178° viewing angle.',
          'Android 11 smart platform with 32GB internal storage.',
          'Time Shift, TV recording, and built-in DVB-T/T2 tuner.',
          'WiFi, Bluetooth, and phone mirroring (miracast / e-share).',
          'Two remotes included: standard IR and Bluetooth Air Mouse.',
          'Available in 55", 65", and 75" with a high-end frame and stand.',
        ],
      },
      fa: {
        name: "تلویزیون هوشمند LED 4K D'code مدل R6D",
        tagline: 'تلویزیون هوشمند 4K UHD با اندروید ۱۱ در سه سایز ۵۵، ۶۵ و ۷۵ اینچ.',
        description:
          "سری R6D برند D'code، پنل شفاف 4K UHD را با پلتفرم هوشمند اندروید ۱۱، ۳۲ گیگابایت حافظه‌ی داخلی و دو ریموت کنترل ترکیب کرده است؛ همه در قابی باریک و پایه‌ای فلزی با کیفیت High-End.",
        highlights: [
          'پنل LED 4K UHD (۳۸۴۰ × ۲۱۶۰) با زاویه دید ۱۷۸ درجه.',
          'پلتفرم هوشمند اندروید ۱۱ با ۳۲ گیگابایت حافظه‌ی داخلی.',
          'قابلیت Time Shift، ضبط برنامه و تیونر دیجیتال داخلی DVB-T/T2.',
          'اتصال WiFi، بلوتوث و اشتراک تصویر گوشی (miracast / e-share).',
          'همراه با دو ریموت: نرمال (IR) و بلوتوثی Air Mouse.',
          'موجود در سه سایز ۵۵، ۶۵ و ۷۵ اینچ با بدنه و پایه‌ی High-End.',
        ],
      },
    },
  },

  {
    id: 'dtec30',
    brand: 'dcode',
    category: 'ac',
    series: 'DTEC30',
    heroImage: acIndoor1,
    remoteImage: acRemote,
    gallery: [acIndoor2, acIndoor3, acOutdoor1, acOutdoor2],
    remotes: {
      en: ['Handheld wired/IR remote control'],
      fa: ['ریموت کنترل دستی'],
    },
    extras: [
      '30,000 BTU cooling',
      'R410A refrigerant',
      'Piston compressor',
      'T3 climate class',
      'Long-distance air supply',
    ],
    variants: [
      {
        sku: 'DTEC-30ARA',
        size: '30,000 BTU',
        capacityBtu: 30000,
        image: acIndoor1,
        // Split system — indoor + outdoor unit dimensions live in `attributes`.
        netWeight: '21 / 65.5 kg',
      },
    ],
    featureCards: [
      {
        title: { en: 'Comfortable Cooling', fa: 'سرمایش دلپذیر' },
        description: {
          en: '30,000 BTU of cooling that holds the room steadily within the comfort range.',
          fa: 'سرمایش ۳۰٬۰۰۰ BTU که دما را به‌طور پیوسته در محدوده‌ی آسایش نگه می‌دارد.',
        },
      },
      {
        title: { en: 'Long-Distance Air Supply', fa: 'پرتاب باد با بُرد بیشتر' },
        description: {
          en: 'A powerful fan throws conditioned air farther to reach larger spaces evenly.',
          fa: 'فن قدرتمند، هوای خنک را با بُرد بیشتری پرتاب می‌کند تا فضاهای بزرگ‌تر یکنواخت خنک شوند.',
        },
      },
      {
        title: { en: 'Quiet Operation', fa: 'عملکرد کم‌صدا' },
        description: {
          en: 'A whisper mode brings the indoor unit down to just 45 dB(A) for restful rooms.',
          fa: 'حالت آرام، صدای یونیت داخلی را تا تنها ۴۵ دسی‌بل کاهش می‌دهد؛ مناسب آسایش.',
        },
      },
      {
        title: { en: 'Durable R410A System', fa: 'سیستم بادوام R410A' },
        description: {
          en: 'An R410A piston-compressor circuit built for reliable cooling in hot climates (T3).',
          fa: 'مدار کمپرسور پیستونی با مبرد R410A، ساخته‌شده برای سرمایش مطمئن در اقلیم گرم (T3).',
        },
      },
    ],
    attributes: [
      {
        label: { en: 'Type', fa: 'نوع' },
        value: { en: 'Cooling only', fa: 'فقط سرمایش' },
      },
      {
        label: { en: 'Cooling capacity', fa: 'ظرفیت سرمایش' },
        value: { en: '30,000 Btu/h (8,792 W)', fa: '۳۰٬۰۰۰ Btu/h (۸٬۷۹۲ وات)' },
      },
      {
        label: { en: 'Energy efficiency (EER)', fa: 'بازده انرژی (EER)' },
        value: { en: '11.05 Btu/h·W (3.24 W/W)', fa: '۱۱٫۰۵ Btu/h·W (۳٫۲۴ W/W)' },
      },
      {
        label: { en: 'Rated power input', fa: 'توان ورودی نامی' },
        value: { en: '2,715 W', fa: '۲٬۷۱۵ وات' },
      },
      {
        label: { en: 'Refrigerant', fa: 'مبرد' },
        value: { en: 'R410A / 2,000 g', fa: 'R410A / ۲٬۰۰۰ گرم' },
      },
      {
        label: { en: 'Compressor', fa: 'کمپرسور' },
        value: {
          en: 'Piston (CP30K8ME-PFZ-101MM)',
          fa: 'پیستونی (CP30K8ME-PFZ-101MM)',
        },
      },
      {
        label: { en: 'Power supply', fa: 'برق مصرفی' },
        value: { en: '220–240V~ / 50Hz / 1-phase', fa: '۲۲۰–۲۴۰ ولت / ۵۰ هرتز / تک‌فاز' },
      },
      {
        label: { en: 'Indoor noise level', fa: 'صدای یونیت داخلی' },
        value: { en: '48–57 dB(A) (Quiet 45)', fa: '۴۸ تا ۵۷ دسی‌بل (آرام ۴۵)' },
      },
      {
        label: { en: 'Indoor fan airflow', fa: 'دبی هوای فن داخلی' },
        value: { en: '1,630 / 1,680 m³/h', fa: '۱٬۶۳۰ / ۱٬۶۸۰ متر مکعب بر ساعت' },
      },
      {
        label: { en: 'Climate class', fa: 'کلاس آب‌وهوایی' },
        value: { en: 'T3', fa: 'T3' },
      },
      {
        label: { en: 'Pipe (liquid / gas)', fa: 'لوله (مایع / گاز)' },
        value: {
          en: 'Φ9.52 / Φ15.88 mm (3/8" / 5/8")',
          fa: 'Φ۹٫۵۲ / Φ۱۵٫۸۸ میلی‌متر (۳/۸ / ۵/۸ اینچ)',
        },
      },
      {
        label: { en: 'Indoor unit (W×D×H)', fa: 'یونیت داخلی (عرض×عمق×ارتفاع)' },
        value: { en: '1277 × 360 × 271 mm', fa: '۱۲۷۷ × ۳۶۰ × ۲۷۱ میلی‌متر' },
      },
      {
        label: { en: 'Outdoor unit (W×D×H)', fa: 'یونیت بیرونی (عرض×عمق×ارتفاع)' },
        value: { en: '976 × 421 × 804 mm', fa: '۹۷۶ × ۴۲۱ × ۸۰۴ میلی‌متر' },
      },
      {
        label: { en: 'Net weight (indoor / outdoor)', fa: 'وزن خالص (داخلی / بیرونی)' },
        value: { en: '21 / 65.5 kg', fa: '۲۱ / ۶۵٫۵ کیلوگرم' },
      },
    ],
    specs: {
      en: [
        'Cooling-only split air conditioner',
        '30,000 Btu/h cooling capacity',
        'High efficiency — EER 11.05 Btu/h·W',
        'Eco-friendly R410A refrigerant',
        'Durable piston compressor',
        'T3 climate class (hot-climate ready)',
        'Long-distance air supply',
        'Quiet mode down to 45 dB(A)',
        'Indoor airflow up to 1,680 m³/h',
        '220–240V single-phase power',
        'Copper piping (Φ9.52 / Φ15.88 mm)',
        'Handheld remote control included',
      ],
      fa: [
        'کولر گازی اسپلیت، فقط سرمایش',
        'ظرفیت سرمایش ۳۰٬۰۰۰ Btu/h',
        'بازده بالا — EER ۱۱٫۰۵ Btu/h·W',
        'مبرد سازگار با محیط زیست R410A',
        'کمپرسور پیستونی بادوام',
        'کلاس آب‌وهوایی T3 (مناسب اقلیم گرم)',
        'پرتاب باد با بُرد بیشتر',
        'حالت آرام تا ۴۵ دسی‌بل',
        'دبی هوای داخلی تا ۱٬۶۸۰ متر مکعب بر ساعت',
        'برق تک‌فاز ۲۲۰ تا ۲۴۰ ولت',
        'لوله‌کشی مسی (Φ۹٫۵۲ / Φ۱۵٫۸۸ میلی‌متر)',
        'همراه با ریموت کنترل دستی',
      ],
    },
    copy: {
      en: {
        name: "D'code DTEC30 30,000 BTU Split Air Conditioner",
        tagline: '30,000 BTU cooling-only split air conditioner for large rooms.',
        description:
          "D'code's DTEC30 is a cooling-only split air conditioner delivering 30,000 BTU with an efficient R410A piston-compressor circuit, long-distance air supply, and a quiet mode — built to keep large rooms comfortable even in hot (T3) climates.",
        highlights: [
          '30,000 BTU cooling with EER 11.05 Btu/h·W efficiency.',
          'Eco-friendly R410A refrigerant and durable piston compressor.',
          'Long-distance air supply for even cooling across large spaces.',
          'Quiet indoor operation down to 45 dB(A).',
          'T3 climate class — reliable cooling in hot climates.',
          '220–240V single-phase power with a handheld remote.',
        ],
      },
      fa: {
        name: "کولر گازی اسپلیت ۳۰٬۰۰۰ D'code مدل DTEC30",
        tagline: 'کولر گازی اسپلیت فقط سرمایش با ظرفیت ۳۰٬۰۰۰ BTU برای فضاهای بزرگ.',
        description:
          "مدل DTEC30 برند D'code یک کولر گازی اسپلیت فقط سرمایش با ظرفیت ۳۰٬۰۰۰ BTU است؛ مجهز به مدار کمپرسور پیستونی پربازده با مبرد R410A، پرتاب باد با بُرد بیشتر و حالت آرام — ساخته‌شده تا فضاهای بزرگ را حتی در اقلیم گرم (T3) خنک و دلپذیر نگه دارد.",
        highlights: [
          'سرمایش ۳۰٬۰۰۰ BTU با بازده EER ۱۱٫۰۵ Btu/h·W.',
          'مبرد سازگار با محیط زیست R410A و کمپرسور پیستونی بادوام.',
          'پرتاب باد با بُرد بیشتر برای سرمایش یکنواخت فضاهای بزرگ.',
          'عملکرد آرام یونیت داخلی تا ۴۵ دسی‌بل.',
          'کلاس آب‌وهوایی T3 — سرمایش مطمئن در اقلیم گرم.',
          'برق تک‌فاز ۲۲۰ تا ۲۴۰ ولت همراه با ریموت کنترل دستی.',
        ],
      },
    },
  },
];

// Convenience lookups for pages and (later) the DB→fallback chain.
export const getDcodeProductById = (id: string): DcodeProduct | undefined =>
  DCODE_PRODUCTS.find((product) => product.id === id);

export const getDcodeProductBySku = (sku: string): DcodeProduct | undefined =>
  DCODE_PRODUCTS.find((product) => product.variants.some((variant) => variant.sku === sku));

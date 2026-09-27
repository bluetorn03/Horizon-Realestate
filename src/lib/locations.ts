/**
 * Indian geography, terminology and amenity vocabulary used across the
 * platform. All seed listings, filters and forms are driven from this module
 * so the marketplace stays consistent as data grows.
 */

export interface IndianCity {
  /** City name as shown in listings and filters. */
  name: string;
  /** State / union territory. */
  state: string;
  /** Neighbourhoods & micro-markets buyers search by. */
  microMarkets: string[];
  /** Short editorial descriptor used in the location showcase. */
  blurb: string;
  /** Unsplash photograph identifier for the city. */
  imageId: string;
  /** Indicative price range for the micro-market, in INR. */
  indicativeRatePerSqft: [number, number];
}

export const INDIAN_CITIES: IndianCity[] = [
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    microMarkets: [
      'Bandra West',
      'Worli',
      'Lower Parel',
      'Powai',
      'Juhu',
      'Andheri West',
      'Malabar Hill',
      'Colaba',
      'Byculla',
    ],
    blurb: 'Sea-facing residences and redeveloped mill-land towers in India’s financial capital.',
    imageId: 'photo-1753806389001-80e994bfbf04',
    indicativeRatePerSqft: [28000, 120000],
  },
  {
    name: 'Navi Mumbai',
    state: 'Maharashtra',
    microMarkets: ['Kharghar', 'Vashi', 'Nerul', 'Seawoods', 'Ulwe', 'Belapur', 'Panvel'],
    blurb: 'Planned node townships with wide avenues, golf greens and metro connectivity.',
    imageId: 'photo-1565838500329-d10006e80f55',
    indicativeRatePerSqft: [9000, 24000],
  },
  {
    name: 'Thane',
    state: 'Maharashtra',
    microMarkets: [
      'Ghodbunder Road',
      'Hiranandani Estate',
      'Majiwada',
      'Kolshet',
      'Pokhran Road 2',
      'Balkum',
    ],
    blurb: 'Lakeside township living minutes from the Eastern Express Highway.',
    imageId: 'photo-1564213053454-7fc0a81a3ea9',
    indicativeRatePerSqft: [11000, 26000],
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    microMarkets: [
      'Koregaon Park',
      'Boat Club Road',
      'Baner',
      'Hinjawadi',
      'Kharadi',
      'Viman Nagar',
      'Aundh',
    ],
    blurb: 'Garden-city bungalows and IT-corridor apartments beneath the Sahyadris.',
    imageId: 'photo-1705955463252-e3f670e4041b',
    indicativeRatePerSqft: [8000, 30000],
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    microMarkets: [
      'Indiranagar',
      'Koramangala',
      'Whitefield',
      'Jayanagar',
      'Hebbal',
      'Sarjapur Road',
      'Embassy Golf Links',
    ],
    blurb: 'Villa communities and high-rise campuses in India’s technology capital.',
    imageId: 'photo-1706241137081-4b5e0f038d88',
    indicativeRatePerSqft: [9000, 28000],
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    microMarkets: [
      'Jubilee Hills',
      'Banjara Hills',
      'Gachibowli',
      'Kondapur',
      'Financial District',
      'Kokapet',
      'HITEC City',
    ],
    blurb: 'Lakefront estates and glass-tower residences across the HITEC corridor.',
    imageId: 'photo-1764675286686-69b0e84d953c',
    indicativeRatePerSqft: [7000, 32000],
  },
  {
    name: 'Delhi NCR',
    state: 'Delhi',
    microMarkets: [
      'Golf Course Road, Gurugram',
      'Dwarka Expressway',
      'Saket',
      'Vasant Kunj',
      'Greater Kailash',
      'Noida Sector 150',
      'Cyber Hub',
    ],
    blurb: 'Gated addresses from Lutyens’ Delhi to Gurugram’s Golf Course Road.',
    imageId: 'photo-1787055482226-8544df1e754a',
    indicativeRatePerSqft: [10000, 45000],
  },
  {
    name: 'Goa',
    state: 'Goa',
    microMarkets: ['Assagao', 'Siolim', 'Anjuna', 'Candolim', 'Dona Paula', 'Majorda', 'Palolem'],
    blurb: 'Portuguese-era villas and sea-breeze holiday homes on the Konkan coast.',
    imageId: 'photo-1652820330085-82a0c2b88d78',
    indicativeRatePerSqft: [12000, 60000],
  },
];

export const CITY_NAMES = INDIAN_CITIES.map((c) => c.name);

export const INDIAN_STATES = Array.from(new Set(INDIAN_CITIES.map((c) => c.state)));

/** Flattened locality list for the hero search dropdown. */
export const ALL_LOCALITIES: { label: string; city: string }[] = INDIAN_CITIES.flatMap((city) => [
  { label: `${city.name}, ${city.state}`, city: city.name },
  ...city.microMarkets.map((m) => ({ label: `${m}, ${city.name}`, city: city.name })),
]);

export const AMENITY_OPTIONS: string[] = [
  'RERA Registered',
  'Clubhouse',
  'Swimming Pool',
  'Covered Parking',
  'Visitor Parking',
  'Power Backup',
  'Lift / Elevator',
  '24x7 Security',
  'CCTV Surveillance',
  'Children’s Play Area',
  'Landscaped Garden',
  'Gymnasium',
  'Yoga & Meditation Deck',
  'Jogging Track',
  'Indoor Games Room',
  'Banquet Hall',
  'Home Theatre',
  'Modular Kitchen',
  'Air Conditioning',
  'Vaastu Compliant',
  'Rain Water Harvesting',
  'Sewage Treatment Plant',
  'Pet Friendly',
  'Servant Quarter',
  'Private Terrace',
  'Sea Facing',
  'Golf Course View',
  'Gated Township',
  'EV Charging Point',
  'High-Speed Fiber Internet',
];

export const FACING_OPTIONS = [
  'East',
  'West',
  'North',
  'South',
  'North-East',
  'North-West',
  'South-East',
  'South-West',
];

export const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-Furnished', 'Furnished'] as const;

export const POSSESSION_OPTIONS = [
  'Ready to Move',
  'Under Construction',
  'New Launch',
] as const;

export const AGE_OPTIONS = [
  '0–1 years',
  '1–5 years',
  '5–10 years',
  '10–20 years',
  '20+ years',
];

export const LISTING_TYPE_LABELS: Record<string, string> = {
  sale: 'For Sale',
  rent: 'For Rent',
  commercial: 'Commercial Lease',
};

export const CATEGORY_LABELS: Record<string, string> = {
  House: 'Independent House',
  Apartment: 'Apartment / Flat',
  Villa: 'Villa',
  Plot: 'Residential Plot',
  Commercial: 'Commercial Office',
};

/** Standard Indian viewing slots (10:00 AM – 7:00 PM). */
export const VIEWING_TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
  '07:00 PM',
];

/** Brand + contact details for the Indian entity. */
export const BRAND = {
  name: 'Horizon Estates',
  tagline: 'India’s Curated Property House',
  legalName: 'Horizon Estates Private Limited',
  addressLine1: 'Level 9, One BKC, G Block, Bandra Kurla Complex',
  addressLine2: 'Bandra East, Mumbai 400051, Maharashtra, India',
  phonePrimary: '+91 22 6789 4500',
  phoneSecondary: '+91 98200 45678',
  emailPrimary: 'advisory@horizonestates.in',
  emailSecondary: 'listings@horizonestates.in',
  hours: 'Monday – Saturday · 9:30 AM – 7:30 PM IST',
  rera: 'Maharashtra RERA A52100012345',
  cin: 'U70200MH2014PTC254789',
  gst: '27AABCH1234E1Z5',
};

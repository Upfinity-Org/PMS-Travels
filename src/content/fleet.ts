import { PHOTOS } from '../lib/images';
import { rupees } from '../lib/format';

export type Rate = { from: number; unit: string };

export type FleetCar = {
  slug: string;
  name: string;
  models: string;
  copy: string;
  seats: string;
  /** Unsplash photo id, see src/lib/images.ts */
  photo: string;
  imageAlt: string;
  accent: string;
  local: Rate;
  outstation: Rate;
  driver: string;
  detail: {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    intro: string[];
    bestFor: string[];
    vehicles: { name: string; note: string }[];
  };
};

// Update these values whenever rates change. The price chart pulls directly from this list.
export const fleet: FleetCar[] = [
  {
    slug: 'sedans',
    name: 'Sedans',
    models: 'Swift Dzire · Hyundai Aura',
    copy: 'Smart, punctual rides for city plans and airport arrivals.',
    seats: '4 guests',
    photo: PHOTOS.sedan,
    imageAlt: 'Sedan car available for local and outstation rental with driver',
    accent: 'Everyday ease',
    local: { from: 2200, unit: '8 hrs' },
    outstation: { from: 13, unit: 'km' },
    driver: 'Driver allowance extra',
    detail: {
      metaTitle: 'Sedan Rental with Driver (Dzire, Aura)',
      metaDescription:
        'Hire a Swift Dzire or Hyundai Aura sedan with driver for city trips, airport transfers and outstation journeys. Seats 4 guests. Rates from ₹2,200 for 8 hours or ₹13 per km.',
      h1: 'Sedan rentals for city plans and airport arrivals',
      intro: [
        'Our sedans are the simplest way to get around: a punctual driver, a comfortable seat and a fare you have agreed before the trip starts. They suit couples, small families and business travellers who want a smooth ride without paying for space they will not use.',
        'Choose a local package when your plans stay within the city, or an outstation rate when the road runs longer. Either way our team confirms the vehicle, timing and fare with you before you travel.',
      ],
      bestFor: [
        'Airport pickups and drops',
        'Business meetings and city errands',
        'Couples and small families on weekend outings',
        'Short temple visits and day trips',
      ],
      vehicles: [
        { name: 'Swift Dzire', note: 'Seats up to 4 guests' },
        { name: 'Hyundai Aura', note: 'Seats up to 4 guests' },
      ],
    },
  },
  {
    slug: 'mpv-suv',
    name: 'MPVs & SUVs',
    models: 'Ertiga · Innova Crysta',
    copy: 'The comfortable choice for family days and long roads.',
    seats: '6–7 guests',
    photo: PHOTOS.suv,
    imageAlt: 'Ertiga and Innova Crysta style MPV and SUV rental for family travel',
    accent: 'Room to roam',
    local: { from: 3000, unit: '8 hrs' },
    outstation: { from: 17, unit: 'km' },
    driver: 'Driver allowance extra',
    detail: {
      metaTitle: 'Ertiga & Innova Crysta Rental with Driver',
      metaDescription:
        'Rent an Ertiga or Innova Crysta with driver for family trips, temple circuits and long outstation journeys. Seats 6 to 7 guests. Rates from ₹3,000 for 8 hours or ₹17 per km.',
      h1: 'MPV and SUV rentals for family days and long roads',
      intro: [
        'When the whole family is travelling, or the road ahead is long, the extra room of an Ertiga or Innova Crysta makes a real difference. Everyone gets space to settle in, and there is more room for the bags that come with a multi-day trip.',
        'These vehicles are a popular pick for pilgrimage circuits, hill-station holidays and airport runs with luggage. Tell us your route and dates and our team will suggest the right fit and confirm the fare up front.',
      ],
      bestFor: [
        'Family holidays and weekend escapes',
        'Temple and pilgrimage circuits',
        'Long outstation journeys with luggage',
        'Small groups travelling together',
      ],
      vehicles: [
        { name: 'Ertiga', note: 'Seats 6 to 7 guests' },
        { name: 'Innova Crysta', note: 'Seats 6 to 7 guests' },
      ],
    },
  },
  {
    slug: 'tempo-traveller',
    name: 'Group Travellers',
    models: 'Tempo Traveller · Urbania',
    copy: 'Made for everyone to travel together, without compromise.',
    seats: '12–17 guests',
    photo: PHOTOS.traveller,
    imageAlt: 'Tempo Traveller and Urbania group vehicle for tours and outings',
    accent: 'Together, comfortably',
    local: { from: 5500, unit: '8 hrs' },
    outstation: { from: 25, unit: 'km' },
    driver: 'Driver allowance extra',
    detail: {
      metaTitle: 'Tempo Traveller & Urbania Rental',
      metaDescription:
        'Book a Tempo Traveller or Urbania with driver for group tours, temple trips, college and corporate outings. Seats 12 to 17 guests. Rates from ₹5,500 for 8 hours or ₹25 per km.',
      h1: 'Tempo Traveller and Urbania rentals for group travel',
      intro: [
        'A group travelling in several cars is harder to coordinate and easier to lose along the way. A Tempo Traveller or Urbania keeps everyone in one vehicle, on one schedule, with one driver who knows the plan.',
        'They are a natural fit for family gatherings, college trips, office outings and pilgrimage groups. Share your headcount, route and dates and we will confirm the right vehicle and a clear fare before you go.',
      ],
      bestFor: [
        'Corporate and college outings',
        'Family functions and get-togethers',
        'Group temple and pilgrimage tours',
        'Multi-day South India tours for larger parties',
      ],
      vehicles: [
        { name: 'Tempo Traveller', note: 'Seats 12 to 17 guests' },
        { name: 'Urbania', note: 'Seats 12 to 17 guests' },
      ],
    },
  },
];

export const localRateLabel = (car: FleetCar): string => `From ${rupees(car.local.from)} / ${car.local.unit}`;
export const outstationRateLabel = (car: FleetCar): string => `From ${rupees(car.outstation.from)} / ${car.outstation.unit}`;
export const getCar = (slug: string | undefined): FleetCar | undefined => fleet.find((c) => c.slug === slug);

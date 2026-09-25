export type Service = {
  slug: string;
  /** Short name used in lists and navigation. */
  name: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  arrange: string[];
  goodToKnow: string[];
  /** slugs from src/content/fleet.ts, in order of suitability */
  vehicles: string[];
  /** value pre-selected in the enquiry form */
  enquiryType: string;
};

// The five services listed on the original home page, now each with its own page.
export const services: Service[] = [
  {
    slug: 'temple-pilgrimage-tours',
    name: 'Temple & pilgrimage circuits',
    summary: 'Multi-stop temple routes planned around darshan timings and your group.',
    metaTitle: 'Temple & Pilgrimage Tour Taxi Service',
    metaDescription:
      'Car and traveller rentals with driver for temple and pilgrimage circuits across Tamil Nadu and South India. Tell us the temples and dates; we plan the route and confirm the fare.',
    h1: 'Temple and pilgrimage circuits, planned around your day',
    intro: [
      'Tamil Nadu is full of temple towns worth the journey, from Madurai and Rameswaram to Thanjavur, Kanchipuram and Palani. A circuit that links several of them saves days compared with booking each leg separately.',
      'Tell us which temples you want to visit, your dates and how many people are travelling. We plan a sensible route, suggest the right vehicle and confirm the fare before you leave, so the trip can be about the darshan rather than the logistics.',
    ],
    arrange: [
      'A route that links your temples in a practical order',
      'A vehicle sized for your family or pilgrimage group',
      'Early-morning starts for timed darshans',
      'A driver who stays with you for the whole circuit',
    ],
    goodToKnow: [
      'Share the temples on your list and we will help sequence them.',
      'Multi-day circuits are quoted per kilometre; driver allowance is extra.',
      'Tolls and trip duration can change the final quote, and we confirm it before you go.',
    ],
    vehicles: ['mpv-suv', 'tempo-traveller', 'sedans'],
    enquiryType: 'Temple & pilgrimage circuit',
  },
  {
    slug: 'family-weekend-trips',
    name: 'Family escapes & weekend outings',
    summary: 'Comfortable vehicles for hill stations, beaches and weekends away.',
    metaTitle: 'Family Trip & Weekend Getaway Cabs',
    metaDescription:
      'Hire a comfortable car, MPV or traveller with driver for family holidays and weekend outings from Tamil Nadu, including hill stations and beach towns. Clear fares confirmed up front.',
    h1: 'Family escapes and weekend outings, without the driving',
    intro: [
      'A family trip works best when nobody has to worry about the road. With a driver at the wheel, parents can watch the view, children can nap and the whole day starts and ends without a parking hunt.',
      'From hill-station getaways such as Ooty and Kodaikanal to a day out by the coast, we match the vehicle to your group and the route. Our team confirms a clear fare before you travel.',
    ],
    arrange: [
      'A vehicle sized for your family and their luggage',
      'Pickups from your home at a time that suits you',
      'Flexible plans for weekend and day outings',
      'Support from our team if your plans change on the way',
    ],
    goodToKnow: [
      'Tell us the number of guests, including children, so we suggest the right vehicle.',
      'For same-day city plans, a local package (from 8 hours) is often the simplest.',
      'For longer routes, outstation per-kilometre rates apply.',
    ],
    vehicles: ['mpv-suv', 'sedans', 'tempo-traveller'],
    enquiryType: 'Family or weekend outing',
  },
  {
    slug: 'corporate-college-travel',
    name: 'Corporate and college travel',
    summary: 'Group vehicles for staff outings, events, study tours and campus trips.',
    metaTitle: 'Corporate & College Group Travel',
    metaDescription:
      'Group transport for corporate outings, staff events, college trips and study tours. Tempo Traveller, Urbania, MPV and sedan rentals with driver, with fares confirmed before you travel.',
    h1: 'Corporate and college travel that keeps the group together',
    intro: [
      'Moving a team or a class is mostly about timing. One vehicle, one departure time and one driver who knows the schedule keeps everyone together and the day on track.',
      'Share your headcount, dates and itinerary and our team will recommend a Tempo Traveller, Urbania or a mix of vehicles, then confirm the fare before the trip.',
    ],
    arrange: [
      'Group vehicles for 12 to 17 guests, plus cars for smaller parties',
      'On-time pickups for early starts and event days',
      'Single-day outings and multi-day study tours',
      'A point of contact on our travel team for changes',
    ],
    goodToKnow: [
      'Larger groups can be split across more than one vehicle. We will suggest the best mix.',
      'Send the schedule in advance so pickup times are planned around it.',
      'Driver allowance is extra; the confirmed quote lists everything before you go.',
    ],
    vehicles: ['tempo-traveller', 'mpv-suv', 'sedans'],
    enquiryType: 'Corporate or college travel',
  },
  {
    slug: 'airport-pickup-drop',
    name: 'Airport drops & pickups',
    summary: 'On-time transfers for early flights, late arrivals and everything in between.',
    metaTitle: 'Airport Pickup & Drop with Driver',
    metaDescription:
      'Book an airport pickup or drop with a punctual driver. Sedans, MPVs and travellers for solo travellers, families and groups. Share your flight details and we confirm the fare in advance.',
    h1: 'Airport drops and pickups that run on time',
    intro: [
      'Airport travel leaves no room for a late cab. Our drivers plan around your flight so you are at the terminal when you need to be, and met on arrival when you land.',
      'Share your flight details and the number of guests and bags. We suggest the right vehicle, confirm the fare and keep you informed, including for early-morning and late-night flights.',
    ],
    arrange: [
      'Pickup timed to your departure, with a sensible buffer',
      'A driver ready when your flight lands',
      'A vehicle sized for your guests and their luggage',
      'Round-trip plans if you want the same driver back',
    ],
    goodToKnow: [
      'Send your flight number and terminal when you enquire.',
      'Our travel support team is reachable around the clock if a flight is delayed.',
      'Sedans suit most solo and couple transfers; families with luggage often prefer an MPV.',
    ],
    vehicles: ['sedans', 'mpv-suv', 'tempo-traveller'],
    enquiryType: 'Airport pickup or drop',
  },
  {
    slug: 'custom-south-india-tours',
    name: 'Custom South India itineraries',
    summary: 'Multi-day routes built around the places you want to see.',
    metaTitle: 'Custom South India Tour Itineraries',
    metaDescription:
      'Plan a multi-day South India journey with a private car and driver. Tell us the places, dates and group size; we build the route, suggest the vehicle and confirm the fare before you go.',
    h1: 'Custom South India itineraries, built around your plans',
    intro: [
      'The best long trips are the ones shaped around the people taking them. Whether you are stringing together temples, hill stations and beaches or planning a slower route with time to linger, we build the itinerary with you.',
      'Share the places you want to see, your dates and your group size. Our team suggests a route and a vehicle, and confirms a clear fare so you know what to expect before you set off.',
    ],
    arrange: [
      'A day-by-day route that links your stops sensibly',
      'A vehicle matched to your group and luggage',
      'One driver for the entire journey',
      'Support from our team throughout the trip',
    ],
    goodToKnow: [
      'Start with a rough list of places; we will help with sequencing and timing.',
      'Multi-day trips are quoted on outstation per-kilometre rates plus driver allowance.',
      'Route, dates, tolls and trip duration all shape the final quote.',
    ],
    vehicles: ['mpv-suv', 'sedans', 'tempo-traveller'],
    enquiryType: 'Custom South India itinerary',
  },
];

export const getService = (slug: string | undefined): Service | undefined => services.find((s) => s.slug === slug);

import { businessPhone, usBusinessPhone } from './contact';

// Company-verified offices and service regions, updated by Jim on 28 October 2026.
// No Lebanese street address, coordinates, staffing or legal entity inferred.
export const serviceRegions = [
  { '@type': 'Place', name: 'Middle East and North Africa (MENA)' },
  { '@type': 'Country', name: 'United States' }
];

export const offices = [
  {
    label: 'Lebanon office',
    addressLines: ['Enterprise & Innovation Centre', 'Dbayeh, Lebanon'],
    phone: businessPhone,
    place: {
      '@type': 'Place',
      name: 'ITKeepers Lebanon office',
      telephone: businessPhone.display,
      address: { '@type': 'PostalAddress', addressLocality: 'Dbayeh', addressCountry: 'LB' },
      containedInPlace: { '@type': 'Place', name: 'Enterprise & Innovation Centre' }
    }
  },
  {
    label: 'USA office',
    addressLines: ['ITKeepers', '6778 NW 66th Ave', 'Parkland, FL 33067', 'United States'],
    phone: usBusinessPhone,
    place: {
      '@type': 'Place',
      name: 'ITKeepers USA office',
      telephone: usBusinessPhone.display,
      address: { '@type': 'PostalAddress', streetAddress: '6778 NW 66th Ave', addressLocality: 'Parkland', addressRegion: 'FL', postalCode: '33067', addressCountry: 'US' }
    }
  }
];

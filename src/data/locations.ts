// Company-verified physical offices, supplied by Jim on 26 October 2026.
// No street address, postal code, coordinates, staffing or legal entity inferred.
export const offices = [
  {
    label: 'Lebanon office',
    detail: 'Enterprise & Innovation Centre, Dbayeh, Lebanon',
    place: {
      '@type': 'Place',
      name: 'ITKeepers Lebanon office',
      address: { '@type': 'PostalAddress', addressLocality: 'Dbayeh', addressCountry: 'LB' },
      containedInPlace: { '@type': 'Place', name: 'Enterprise & Innovation Centre' }
    }
  },
  {
    label: 'USA office',
    detail: 'Pompano Beach, Florida, USA',
    place: {
      '@type': 'Place',
      name: 'ITKeepers USA office',
      address: { '@type': 'PostalAddress', addressLocality: 'Pompano Beach', addressRegion: 'Florida', addressCountry: 'US' }
    }
  }
];

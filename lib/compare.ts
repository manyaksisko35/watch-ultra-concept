export const GAINS = [
  { value: '5,000', label: 'nits peak, vs 3,000' },
  { value: '800 mAh', label: 'battery, vs 590 mAh' },
  { value: '-1.4 mm', label: 'thinner case' },
  { value: '~40%', label: 'charge in about 30 min' },
];

export const ROWS: { label: string; ultra2: string; ultra1: string; up?: boolean }[] = [
  { label: 'Thickness', ultra2: '10.7 mm', ultra1: '12.1 mm', up: true },
  { label: 'Weight', ultra2: '61.5 g', ultra1: '60.5 g' },
  { label: 'Display', ultra2: '1.52" Super AMOLED', ultra1: '1.5" Super AMOLED', up: true },
  { label: 'Brightness', ultra2: 'Up to 5,000 nits', ultra1: 'Up to 3,000 nits', up: true },
  { label: 'Processor', ultra2: 'Snapdragon Wear Elite (3 nm)', ultra1: 'Exynos W1000 (3 nm)', up: true },
  { label: 'Battery', ultra2: '800 mAh', ultra1: '590 mAh', up: true },
  { label: 'Charging', ultra2: 'Fast charging, ~40% in 30 min', ultra1: 'Standard', up: true },
  { label: 'Water and dust', ultra2: '10ATM + IP69K', ultra1: '10ATM + IP68', up: true },
  { label: 'Diving', ultra2: 'EN13319, to 40 m', ultra1: '—', up: true },
  { label: 'Bluetooth', ultra2: '6.0', ultra1: '5.3', up: true },
  { label: 'Colors', ultra2: 'Titanium Gray, Silver', ultra1: 'Blue, Silver, Gray, White' },
  { label: 'Price (US, at launch)', ultra2: '$699.99', ultra1: '$649.99' },
];

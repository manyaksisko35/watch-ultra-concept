export const GAINS = [
  { value: '3,000', label: 'nits peak, vs 2,000' },
  { value: '590 mAh', label: 'battery, vs 425 mAh' },
  { value: '10ATM', label: 'water rating, vs 5ATM' },
  { value: 'Titanium', label: 'Grade 4 case' },
];

export const ROWS: { label: string; ultra: string; w7: string; up?: boolean }[] = [
  { label: 'Case', ultra: 'Titanium, 47 mm', w7: 'Aluminum, 40 / 44 mm', up: true },
  { label: 'Display', ultra: '1.5", 480 × 480, up to 3,000 nits', w7: 'Up to 1.5", up to 2,000 nits', up: true },
  { label: 'Glass', ultra: 'Sapphire crystal', w7: 'Sapphire crystal' },
  { label: 'Processor', ultra: 'Exynos W1000 (3 nm)', w7: 'Exynos W1000 (3 nm)' },
  { label: 'Battery', ultra: '590 mAh', w7: '300 / 425 mAh', up: true },
  { label: 'Water resistance', ultra: '10ATM + IP68', w7: '5ATM + IP68', up: true },
  { label: 'Quick Button', ultra: 'Yes, with emergency siren', w7: '—', up: true },
  { label: 'GPS', ultra: 'Dual-frequency (L1 + L5)', w7: 'Dual-frequency (L1 + L5)' },
  { label: 'Connectivity', ultra: 'LTE standard', w7: 'Bluetooth or LTE', up: true },
];

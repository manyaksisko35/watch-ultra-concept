export const GAINS = [
  { value: '590 mAh', label: 'battery, vs 445 mAh' },
  { value: '10ATM', label: 'water rating, vs 5ATM' },
  { value: 'Titanium', label: 'Grade 4 case, vs aluminum' },
  { value: 'Quick Button', label: 'with emergency siren' },
];

export const ROWS: { label: string; ultra: string; w9: string; up?: boolean }[] = [
  { label: 'Case', ultra: 'Titanium, 47 mm', w9: 'Aluminum, 40 / 44 mm', up: true },
  { label: 'Display', ultra: '1.5", 480 × 480', w9: '1.3" / 1.47", up to 480 × 480' },
  { label: 'Brightness', ultra: 'Up to 3,000 nits', w9: 'Up to 3,000 nits' },
  { label: 'Glass', ultra: 'Sapphire crystal', w9: 'Sapphire crystal' },
  { label: 'Processor', ultra: 'Exynos W1000 (3 nm)', w9: 'Snapdragon Wear Elite (3 nm)' },
  { label: 'Battery', ultra: '590 mAh', w9: '390 / 445 mAh', up: true },
  { label: 'Water resistance', ultra: '10ATM + IP68', w9: '5ATM + IP68', up: true },
  { label: 'Quick Button', ultra: 'Yes, with emergency siren', w9: '—', up: true },
  { label: 'Connectivity', ultra: 'LTE standard', w9: 'Bluetooth or LTE', up: true },
  { label: 'Price (US, at launch)', ultra: '$649.99', w9: 'From $379.99' },
];

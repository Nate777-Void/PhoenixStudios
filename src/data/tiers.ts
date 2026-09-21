import { ExhibitionTier } from '../types';

export const EXHIBITION_TIERS: ExhibitionTier[] = [
  {
    id: 'standard',
    name: 'Open Gallery',
    hallName: 'The North Pavilion',
    fee: 5,
    badge: 'Open Wall',
    lighting: 'soft',
    durationDays: 30,
    accentColor: '#94a3b8',
    borderClass: 'border-zinc-700/80',
    description: 'A dedicated exhibition spot on the museum open gallery wall for aspiring and independent creators.',
    perks: [
      '30-day gallery wall presence',
      'Visitor guestbook & like counters',
      'Direct collector inquiry link',
      'Standard silver museum plaque'
    ]
  },
  {
    id: 'spotlight',
    name: 'Spotlight Salon',
    hallName: 'The Luminary Wing',
    fee: 15,
    badge: 'Salon Featured',
    lighting: 'directional',
    durationDays: 60,
    accentColor: '#38bdf8',
    borderClass: 'border-sky-500/50',
    description: 'Prominent eye-level salon placement with dedicated directional illumination and curated artist bio callout.',
    perks: [
      '60-day prominent eye-level display',
      'Atmospheric directional gallery downlight',
      'Curator review callout badge',
      'Artist profile and collector offer channel',
      'Polished brushed metal museum plaque'
    ]
  },
  {
    id: 'grand_salon',
    name: "Grand Curator's Hall",
    hallName: 'The Masterpiece Rotunda',
    fee: 35,
    badge: 'Curator VIP',
    lighting: 'spotlight_halo',
    durationDays: 120,
    accentColor: '#d4af37',
    borderClass: 'border-amber-400/70',
    description: 'Top-tier archival exhibition in the grand rotunda with luminous halo gallery spotlight and digital certificate of authenticity.',
    perks: [
      '120-day prime centerpiece rotunda placement',
      'Radiant warm gallery halo spotlight effect',
      'Gilded brass museum plaque with custom seal',
      'Official registered Exhibition Pass & receipt',
      'Curator spotlight priority in gallery recommendations'
    ]
  }
];

export const GET_TIER = (id: string): ExhibitionTier => {
  return EXHIBITION_TIERS.find(t => t.id === id) || EXHIBITION_TIERS[0];
};

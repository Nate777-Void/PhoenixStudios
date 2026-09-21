import { UserProfile } from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-current',
    username: 'phoenix_artist',
    displayName: 'Elena Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    bio: 'Visual artist and resident creator at PhoenixStudios. Exploring luminous oil glazes, kinetic impressionism, and bespoke commissions.',
    location: 'San Francisco, CA',
    specialties: ['Oil on Canvas', 'Digital Painting', 'Color Theory'],
    categories: ['Studio Highlights', 'Atmospheric Landscapes', 'Portrait Studies', 'Digital Commissions'],
    walletBalance: 1140, // Has already earned from sales
    commissionSettings: {
      acceptingCommissions: true,
      availabilityStatus: 'Open',
      baseRate: 350,
      turnaroundTime: '2-3 weeks',
      guidelines: 'I accept character concepts, landscape environments, and physical oil commissions on archival linen. Detailed references preferred.',
      serviceTiers: [
        {
          id: 'tier-1',
          name: 'Color Study / Portrait',
          price: 250,
          description: 'High-res bust or expressive color study on digital canvas or 12x12 panel.',
          turnaround: '1-2 weeks'
        },
        {
          id: 'tier-2',
          name: 'Full Scene Environment',
          price: 550,
          description: 'Intricate landscape or cinematic composition with atmospheric lighting and high detail.',
          turnaround: '3 weeks'
        },
        {
          id: 'tier-3',
          name: 'Physical Archival Oil Canvas',
          price: 1200,
          description: 'Custom museum-grade oil painting on stretched Belgian linen, varnished and shipped.',
          turnaround: '4-6 weeks'
        }
      ]
    },
    stats: {
      totalSales: 4,
      totalCommissions: 7,
      followers: 840
    }
  },
  {
    id: 'user-clara',
    username: 'claradelacroix',
    displayName: 'Clara Delacroix',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    bio: 'Contemporary oil painter based in Lyon, France. Exploring light refractions across European architectural ruins and sacred spaces.',
    location: 'Lyon, France',
    specialties: ['Classical Oils', 'Chiaroscuro', 'Architectural Studies'],
    categories: ['Sacred Vaults', 'Golden Hour Oils', 'Plein Air Sketches'],
    walletBalance: 2785,
    commissionSettings: {
      acceptingCommissions: true,
      availabilityStatus: 'Limited Slots',
      baseRate: 450,
      turnaroundTime: '3-4 weeks',
      guidelines: 'Focusing exclusively on architectural light studies, interior atmospheres, and historic subjects.',
      serviceTiers: [
        {
          id: 'clara-t1',
          name: 'Plein-Air Architectural Study',
          price: 450,
          description: '16x20 inch oil study of a historic building, cathedral, or countryside archway.',
          turnaround: '3 weeks'
        },
        {
          id: 'clara-t2',
          name: 'Monumental Golden Hour Masterwork',
          price: 1600,
          description: '36x48 inch multi-layered glaze painting depicting intricate classical architecture with dramatic lighting.',
          turnaround: '6 weeks'
        }
      ]
    },
    stats: {
      totalSales: 12,
      totalCommissions: 15,
      followers: 2450
    }
  },
  {
    id: 'user-taro',
    username: 'tarotakahashi',
    displayName: 'Taro Takahashi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    bio: 'Tokyo-based concept illustrator and digital painter. Blending Edo-era ink rhythms with cyberpunk neo-futurism.',
    location: 'Tokyo, Japan',
    specialties: ['Digital Painting', 'Concept Art', 'Cyberpunk Noir'],
    categories: ['Neo-Kyoto Rain', 'Mecha & Characters', 'Keyframe Illumination'],
    walletBalance: 1840,
    commissionSettings: {
      acceptingCommissions: true,
      availabilityStatus: 'Open',
      baseRate: 200,
      turnaroundTime: '1-2 weeks',
      guidelines: 'Digital delivery with full commercial licensing available. Send visual inspiration and color moodboards.',
      serviceTiers: [
        {
          id: 'taro-t1',
          name: 'Cyberpunk Character Concept',
          price: 280,
          description: 'Detailed character portrait or full-body render with custom cybernetic tech and atmospheric glow.',
          turnaround: '10 days'
        },
        {
          id: 'taro-t2',
          name: 'Metropolitan Cityscape Illustration',
          price: 650,
          description: 'Vast cinematic panoramic city in rain, neon signs, and vehicular traffic at 4K resolution.',
          turnaround: '2-3 weeks'
        }
      ]
    },
    stats: {
      totalSales: 8,
      totalCommissions: 22,
      followers: 3890
    }
  },
  {
    id: 'user-astrid',
    username: 'astrid_lindholm',
    displayName: 'Astrid Lindholm',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    bio: 'Nordic minimalist focusing on organic linen textiles, meditative silence, and raw indigo mineral pigments.',
    location: 'Stockholm, Sweden',
    specialties: ['Mixed Media', 'Raw Linen', 'Botanical Washes'],
    categories: ['Indigo Washes', 'Linen Textiles', 'Minimalist Miniatures'],
    walletBalance: 920,
    commissionSettings: {
      acceptingCommissions: false,
      availabilityStatus: 'Closed',
      baseRate: 400,
      turnaroundTime: '4 weeks',
      guidelines: 'Commissions currently closed while preparing for the autumn salon gallery exhibition.',
      serviceTiers: [
        {
          id: 'astrid-t1',
          name: 'Indigo Mineral Linen Panel',
          price: 480,
          description: 'Hand-washed Belgian raw linen treated with natural plant indigo and mineral dust.',
          turnaround: '4 weeks'
        }
      ]
    },
    stats: {
      totalSales: 6,
      totalCommissions: 5,
      followers: 1210
    }
  }
];

export const INITIAL_COMMISSIONS = [
  {
    id: 'comm-101',
    artistId: 'user-current',
    artistName: 'Elena Vance',
    buyerId: 'user-clara',
    buyerName: 'Clara Delacroix',
    buyerEmail: 'clara.delacroix@gallery-mail.art',
    tierId: 'tier-2',
    tierName: 'Full Scene Environment',
    specifications: 'A dramatic twilight seascape featuring a solitary lighthouse perched on jagged black basalt cliffs with golden window illumination.',
    budget: 550,
    deadline: '2026-10-15',
    status: 'pending' as const,
    createdAt: '2026-09-18T10:30:00Z'
  },
  {
    id: 'comm-102',
    artistId: 'user-current',
    artistName: 'Elena Vance',
    buyerId: 'guest-99',
    buyerName: 'Marcus Sterling',
    buyerEmail: 'marcus.sterling@collector-group.com',
    tierId: 'tier-1',
    tierName: 'Color Study / Portrait',
    specifications: 'Oil color study of a Renaissance violinist in deep amber chiaroscuro lighting.',
    budget: 250,
    deadline: '2026-10-01',
    status: 'accepted' as const,
    createdAt: '2026-09-15T14:20:00Z',
    artistNote: 'Accepted! Preliminary underpainting sketch scheduled for next Tuesday.'
  }
];

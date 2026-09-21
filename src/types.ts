export type ArtMedium = 
  | 'Oil on Canvas'
  | 'Acrylic on Linen'
  | 'Digital Painting'
  | 'Mixed Media'
  | 'Watercolor & Ink'
  | 'Photography'
  | 'Charcoal & Pastel';

export type FrameStyle = 
  | 'gold'        // Ornate gilded baroque gold frame
  | 'matte-black' // Sleek contemporary dark frame
  | 'white-oak'   // Nordic warm natural oak
  | 'float'       // Shadowbox raw canvas floating frame
  | 'minimal';    // Frameless fine bevel edge

export type ExhibitionTierId = 'standard' | 'spotlight' | 'grand_salon';

export interface ExhibitionTier {
  id: ExhibitionTierId;
  name: string;
  hallName: string;
  fee: number;
  badge: string;
  lighting: 'soft' | 'directional' | 'spotlight_halo';
  durationDays: number;
  perks: string[];
  description: string;
  accentColor: string;
  borderClass: string;
}

export interface ArtComment {
  id: string;
  author: string;
  role: 'Curator' | 'Collector' | 'Visitor' | 'Artist';
  text: string;
  createdAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistUsername?: string;
  artistBio?: string;
  artistContact?: string;
  category?: string; // Profile category e.g. "Oil Paintings", "Digital Art", "Studies & Sketches"
  description: string;
  medium: ArtMedium;
  dimensions?: string;
  year: number;
  imageUrl: string;
  frameStyle: FrameStyle;
  isForSale: boolean;
  salePrice?: number;
  isSold?: boolean;
  soldTo?: string;
  soldAt?: string;
  likes: number;
  views: number;
  displayTier: ExhibitionTierId;
  displayFeePaid: number;
  exhibitionPassId: string;
  displayedAt: string; // ISO date string
  displayDurationDays: number;
  comments: ArtComment[];
  isUserSubmission?: boolean;
}

export interface CommissionTier {
  id: string;
  name: string;
  price: number;
  description: string;
  turnaround: string;
}

export interface CommissionSettings {
  acceptingCommissions: boolean;
  availabilityStatus: 'Open' | 'Limited Slots' | 'Waitlist' | 'Closed';
  baseRate: number;
  turnaroundTime: string;
  guidelines: string;
  serviceTiers: CommissionTier[];
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  location?: string;
  specialties: string[];
  categories: string[];
  commissionSettings: CommissionSettings;
  walletBalance: number; // net earnings from sales and commissions
  stats: {
    totalSales: number;
    totalCommissions: number;
    followers: number;
  };
}

export type CommissionStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface CommissionRequest {
  id: string;
  artistId: string;
  artistName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  tierId: string;
  tierName: string;
  specifications: string;
  budget: number;
  deadline: string;
  status: CommissionStatus;
  createdAt: string;
  artistNote?: string;
}

export interface MarketplaceOrder {
  id: string;
  artworkId: string;
  artworkTitle: string;
  artworkImageUrl: string;
  artistId: string;
  artistName: string;
  buyerName: string;
  buyerEmail: string;
  salePrice: number;
  platformFee: number; // fixed fee deducted from artist earnings
  artistEarnings: number; // salePrice - platformFee
  status: 'completed' | 'processing';
  orderedAt: string;
  shippingAddress?: string;
}

export interface GalleryFilter {
  medium: string;
  tier: string;
  category: string;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'likes' | 'price_high' | 'price_low';
  forSaleOnly: boolean;
}

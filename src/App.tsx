import React, { useState, useEffect, useMemo } from 'react';
import {
  Artwork,
  GalleryFilter,
  ExhibitionTierId,
  ArtComment,
  UserProfile,
  CommissionRequest,
  MarketplaceOrder
} from './types';
import { INITIAL_ARTWORKS } from './data/initialArtworks';
import { INITIAL_PROFILES, INITIAL_COMMISSIONS } from './data/initialProfiles';
import { EXHIBITION_TIERS, GET_TIER } from './data/tiers';
import { Navbar, MainNavTab } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ArtFrame } from './components/ArtFrame';
import { CuratorHighlight } from './components/CuratorHighlight';
import { ArtworkDetailModal } from './components/ArtworkDetailModal';
import { SubmitArtworkModal } from './components/SubmitArtworkModal';
import { DrawingStudioModal } from './components/DrawingStudioModal';
import { ArtistDashboardModal } from './components/ArtistDashboardModal';
import { UserProfileView } from './components/UserProfileView';
import { MarketplaceView } from './components/MarketplaceView';
import { ArtistsDirectoryView } from './components/ArtistsDirectoryView';
import { CommissionModal } from './components/CommissionModal';
import { MarketplaceCheckoutModal, FIXED_PLATFORM_FEE } from './components/MarketplaceCheckoutModal';
import { EditProfileModal } from './components/EditProfileModal';
import {
  Sparkles,
  Plus,
  Frame,
  DollarSign,
  Palette,
  Eye,
  Heart,
  ShieldCheck,
  Building,
  Info,
  ShoppingBag,
  Users
} from 'lucide-react';

const ARTWORKS_STORAGE_KEY = 'phoenix_studios_artworks_v2';
const PROFILES_STORAGE_KEY = 'phoenix_studios_profiles_v2';
const COMMISSIONS_STORAGE_KEY = 'phoenix_studios_commissions_v2';
const ORDERS_STORAGE_KEY = 'phoenix_studios_orders_v2';

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<MainNavTab>('gallery');

  // Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load profiles', e);
    }
    return INITIAL_PROFILES;
  });

  // Active Current User (default: 'user-current')
  const [currentUserId, setCurrentUserId] = useState<string>('user-current');

  // Currently viewed profile in Profile Tab
  const [viewedProfileId, setViewedProfileId] = useState<string>('user-current');

  // Artworks State
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const stored = localStorage.getItem(ARTWORKS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load artworks', e);
    }
    return INITIAL_ARTWORKS;
  });

  // Commissions State
  const [commissions, setCommissions] = useState<CommissionRequest[]>(() => {
    try {
      const stored = localStorage.getItem(COMMISSIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load commissions', e);
    }
    return INITIAL_COMMISSIONS;
  });

  // Marketplace Orders State
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load orders', e);
    }
    return [
      {
        id: 'PHX-ORD-51920',
        artworkId: 'art-5',
        artworkTitle: 'Morning Mist over the Mistral Ridge',
        artworkImageUrl:
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&q=80',
        artistId: 'user-clara',
        artistName: 'Clara Delacroix',
        buyerName: 'Arthur Pendelton',
        buyerEmail: 'arthur.p@collector-group.com',
        salePrice: 680,
        platformFee: 15,
        artistEarnings: 665,
        status: 'completed',
        orderedAt: '2026-03-16T15:30:00Z',
        shippingAddress: '12 Rue de la Paix, Paris, France'
      }
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(ARTWORKS_STORAGE_KEY, JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(COMMISSIONS_STORAGE_KEY, JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Active Current User Profile object
  const currentUser = useMemo(() => {
    return profiles.find((p) => p.id === currentUserId) || profiles[0];
  }, [profiles, currentUserId]);

  // Profile currently being viewed
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === viewedProfileId) || currentUser;
  }, [profiles, viewedProfileId, currentUser]);

  // Gallery Filters
  const [filters, setFilters] = useState<GalleryFilter>({
    medium: '',
    tier: 'all',
    category: '',
    searchQuery: '',
    sortBy: 'featured',
    forSaleOnly: false
  });

  const [viewMode, setViewMode] = useState<'gallery-wall' | 'compact-grid'>('gallery-wall');

  // Modals state
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isDrawingStudioOpen, setIsDrawingStudioOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [prefilledCanvasImage, setPrefilledCanvasImage] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string | undefined>(undefined);

  // Commission Modal State
  const [commissionTargetArtist, setCommissionTargetArtist] = useState<UserProfile | null>(null);

  // Marketplace Checkout Modal State
  const [checkoutArtwork, setCheckoutArtwork] = useState<Artwork | null>(null);

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Notification Banner
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  // Filtered and Sorted Artworks for Virtual Gallery
  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        if (filters.medium && art.medium !== filters.medium) return false;
        if (filters.tier && filters.tier !== 'all' && art.displayTier !== filters.tier) return false;
        if (filters.forSaleOnly && (!art.isForSale || art.isSold)) return false;
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = art.title.toLowerCase().includes(q);
          const matchArtist = art.artistName.toLowerCase().includes(q);
          const matchDesc = art.description.toLowerCase().includes(q);
          const matchCat = art.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchArtist && !matchDesc && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.displayedAt).getTime() - new Date(a.displayedAt).getTime();
        }
        if (filters.sortBy === 'likes') {
          return b.likes - a.likes;
        }
        if (filters.sortBy === 'price_high') {
          return (b.salePrice || 0) - (a.salePrice || 0);
        }
        if (filters.sortBy === 'price_low') {
          return (a.salePrice || 0) - (b.salePrice || 0);
        }
        // Default: 'featured'
        const tierScore = (t: ExhibitionTierId) => {
          if (t === 'grand_salon') return 3;
          if (t === 'spotlight') return 2;
          return 1;
        };
        const diff = tierScore(b.displayTier) - tierScore(a.displayTier);
        if (diff !== 0) return diff;
        return b.views - a.views;
      });
  }, [artworks, filters]);

  // Centerpiece artwork for highlight marquee
  const highlightArtwork = useMemo(() => {
    return artworks.find((a) => a.displayTier === 'grand_salon') || artworks[0];
  }, [artworks]);

  // Handlers
  const handleLike = (id: string) => {
    setArtworks((prev) =>
      prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
    );
    if (selectedArtwork && selectedArtwork.id === id) {
      setSelectedArtwork((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  const handleInspectArtwork = (art: Artwork) => {
    setArtworks((prev) =>
      prev.map((a) => (a.id === art.id ? { ...a, views: a.views + 1 } : a))
    );
    setSelectedArtwork({ ...art, views: art.views + 1 });
  };

  const handleAddComment = (
    artworkId: string,
    commentData: Omit<ArtComment, 'id' | 'createdAt'>
  ) => {
    const newComment: ArtComment = {
      id: `c-${Date.now()}`,
      ...commentData,
      createdAt: 'Just now'
    };

    setArtworks((prev) =>
      prev.map((a) =>
        a.id === artworkId ? { ...a, comments: [newComment, ...a.comments] } : a
      )
    );

    if (selectedArtwork && selectedArtwork.id === artworkId) {
      setSelectedArtwork((prev) =>
        prev ? { ...prev, comments: [newComment, ...prev.comments] } : null
      );
    }
  };

  const handleInquireSale = (artworkId: string, offerAmount: number, buyerEmail: string) => {
    const targetArt = artworks.find((a) => a.id === artworkId);
    setBannerNotice(
      `Acquisition inquiry for "${targetArt?.title || 'Artwork'}" ($${offerAmount}) submitted! The artist has been notified.`
    );
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleSubmitNewArtwork = (newArt: Artwork) => {
    setArtworks((prev) => [newArt, ...prev]);
    setPrefilledCanvasImage(null);
    setUploadCategory(undefined);
    setBannerNotice(
      `"${newArt.title}" has been successfully mounted on display in ${GET_TIER(newArt.displayTier).name}!`
    );
    setTimeout(() => setBannerNotice(null), 6000);
  };

  const handleDrawingReady = (dataUrl: string) => {
    setPrefilledCanvasImage(dataUrl);
    setIsSubmitOpen(true);
  };

  const handleUpgradeTier = (artworkId: string, newTier: ExhibitionTierId) => {
    const tierConfig = GET_TIER(newTier);
    setArtworks((prev) =>
      prev.map((a) => {
        if (a.id === artworkId) {
          const feeDiff = Math.max(0, tierConfig.fee - a.displayFeePaid);
          return {
            ...a,
            displayTier: newTier,
            displayFeePaid: a.displayFeePaid + feeDiff,
            displayDurationDays: tierConfig.durationDays
          };
        }
        return a;
      })
    );
    setBannerNotice(`Artwork promoted to ${tierConfig.name}! Luminous exhibition lighting applied.`);
    setTimeout(() => setBannerNotice(null), 5000);
  };

  // Commission Handlers
  const handleCommissionSubmitted = (newRequest: CommissionRequest) => {
    setCommissions((prev) => [newRequest, ...prev]);
    setBannerNotice(
      `Commission proposal sent to ${newRequest.artistName}! Budget: $${newRequest.budget}`
    );
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleAcceptCommission = (requestId: string, note?: string) => {
    setCommissions((prev) =>
      prev.map((c) =>
        c.id === requestId
          ? {
              ...c,
              status: 'accepted',
              artistNote: note || 'Commission proposal accepted. Starting preparation.'
            }
          : c
      )
    );
    setBannerNotice('Commission proposal accepted! Production milestone logged.');
    setTimeout(() => setBannerNotice(null), 5000);
  };

  const handleDeclineCommission = (requestId: string) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === requestId ? { ...c, status: 'declined' } : c))
    );
    setBannerNotice('Commission proposal declined.');
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleCompleteCommission = (requestId: string) => {
    const target = commissions.find((c) => c.id === requestId);
    if (!target) return;

    setCommissions((prev) =>
      prev.map((c) => (c.id === requestId ? { ...c, status: 'completed' } : c))
    );

    // Credit artist's wallet
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === target.artistId) {
          return {
            ...p,
            walletBalance: p.walletBalance + target.budget,
            stats: {
              ...p.stats,
              totalCommissions: p.stats.totalCommissions + 1
            }
          };
        }
        return p;
      })
    );

    setBannerNotice(
      `Commission completed! $${target.budget} USD deposited to ${target.artistName}'s wallet.`
    );
    setTimeout(() => setBannerNotice(null), 6000);
  };

  // Marketplace Order Completed Handler
  const handleOrderCompleted = (order: MarketplaceOrder) => {
    setOrders((prev) => [order, ...prev]);

    // Mark artwork as sold
    setArtworks((prev) =>
      prev.map((art) =>
        art.id === order.artworkId
          ? {
              ...art,
              isSold: true,
              soldTo: order.buyerName,
              soldAt: order.orderedAt
            }
          : art
      )
    );

    // Credit artist wallet with salePrice minus fixed platform fee ($15)
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === order.artistId) {
          return {
            ...p,
            walletBalance: p.walletBalance + order.artistEarnings,
            stats: {
              ...p.stats,
              totalSales: p.stats.totalSales + 1
            }
          };
        }
        return p;
      })
    );

    // Update selected artwork in modal if currently inspecting it
    if (selectedArtwork && selectedArtwork.id === order.artworkId) {
      setSelectedArtwork((prev) =>
        prev
          ? {
              ...prev,
              isSold: true,
              soldTo: order.buyerName,
              soldAt: order.orderedAt
            }
          : null
      );
    }

    setBannerNotice(
      `Acquisition confirmed! "${order.artworkTitle}" sold for $${order.salePrice}. Fixed $15 platform fee deducted; $${order.artistEarnings} credited to ${order.artistName}.`
    );
    setTimeout(() => setBannerNotice(null), 7000);
  };

  // Profile Save Handler
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p)));
    setBannerNotice(`Profile for @${updatedProfile.username} successfully updated!`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleCategoryAddedToProfile = (newCat: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          if (!p.categories.includes(newCat)) {
            return {
              ...p,
              categories: [...p.categories, newCat]
            };
          }
        }
        return p;
      })
    );
  };

  // Navigation actions
  const handleViewArtistProfile = (artistId: string) => {
    setViewedProfileId(artistId);
    setCurrentTab('my-profile');
    setSelectedArtwork(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchActiveProfile = (profileId: string) => {
    setCurrentUserId(profileId);
    setViewedProfileId(profileId);
    const target = profiles.find((p) => p.id === profileId);
    setBannerNotice(`Switched active studio account to ${target?.displayName} (@${target?.username})`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const handleOpenCommissionModalForArtist = (artist: UserProfile) => {
    setCommissionTargetArtist(artist);
  };

  const handleOpenCheckoutForArtwork = (art: Artwork) => {
    setCheckoutArtwork(art);
  };

  return (
    <div className="min-h-screen bg-[#121216] text-[#e4e4e7] flex flex-col selection:bg-amber-400/30 selection:text-white">
      {/* Top Banner Notice */}
      {bannerNotice && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border-b border-amber-400/40 text-amber-200 px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in z-50 sticky top-0">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'my-profile') {
            setViewedProfileId(currentUserId);
          }
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        allProfiles={profiles}
        onSwitchProfile={handleSwitchActiveProfile}
        onOpenSubmit={() => {
          setUploadCategory(undefined);
          setIsSubmitOpen(true);
        }}
        onOpenDrawingStudio={() => setIsDrawingStudioOpen(true)}
        totalArtCount={artworks.length}
        marketplaceCount={artworks.filter((a) => a.isForSale && !a.isSold).length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: VIRTUAL GALLERY (Exhibition Halls & Lighting Tiers) */}
        {currentTab === 'gallery' && (
          <div className="space-y-8 animate-fade-in">
            {/* Curator Highlight */}
            {highlightArtwork && (
              <CuratorHighlight
                artwork={highlightArtwork}
                onSelect={handleInspectArtwork}
                onExhibitArt={() => setIsSubmitOpen(true)}
              />
            )}

            {/* Gallery Navigation and Filter Controls */}
            <div className="space-y-4">
              <FilterBar
                filters={filters}
                onChange={setFilters}
                totalFilteredCount={filteredArtworks.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {/* Exhibition Halls Description Banner */}
              {filters.tier !== 'all' && (
                <div
                  className="p-4 rounded-xl border flex items-center justify-between gap-4 text-xs animate-fade-in"
                  style={{
                    backgroundColor: `${GET_TIER(filters.tier as ExhibitionTierId).accentColor}10`,
                    borderColor: `${GET_TIER(filters.tier as ExhibitionTierId).accentColor}40`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2.5 py-1 text-xs font-bold uppercase rounded-sm"
                      style={{
                        backgroundColor: `${GET_TIER(filters.tier as ExhibitionTierId).accentColor}25`,
                        color: GET_TIER(filters.tier as ExhibitionTierId).accentColor
                      }}
                    >
                      {GET_TIER(filters.tier as ExhibitionTierId).name}
                    </span>
                    <span className="text-zinc-300">
                      {GET_TIER(filters.tier as ExhibitionTierId).description}
                    </span>
                  </div>
                  <span className="font-mono text-zinc-400 hidden sm:inline">
                    Display Fee: ${GET_TIER(filters.tier as ExhibitionTierId).fee}.00 • Duration: {GET_TIER(filters.tier as ExhibitionTierId).durationDays} Days
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Wall Display Grid */}
            {filteredArtworks.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-8">
                <Frame className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="font-serif-display text-2xl font-bold text-zinc-200">
                  No artworks found in this collection
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Try adjusting your search query, selecting another medium, or exhibit your own piece to grace this hall.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        medium: '',
                        tier: 'all',
                        category: '',
                        searchQuery: '',
                        sortBy: 'featured',
                        forSaleOnly: false
                      })
                    }
                    className="px-4 py-2 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-850 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(true)}
                    className="px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md"
                  >
                    Exhibit New Art
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-8 sm:gap-10 ${
                  viewMode === 'gallery-wall'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                }`}
              >
                {filteredArtworks.map((artwork) => (
                  <div key={artwork.id} className="relative group">
                    <ArtFrame
                      artwork={artwork}
                      onClick={() => handleInspectArtwork(artwork)}
                      showPlaque={viewMode === 'gallery-wall'}
                    />
                    {artwork.isSold && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xs flex items-center justify-center pointer-events-none z-20">
                        <div className="px-4 py-1.5 bg-rose-500/90 text-white font-serif-display text-sm font-bold tracking-widest uppercase border border-rose-400 shadow-xl rotate-[-6deg]">
                          Sold / Acquired
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ART MARKETPLACE (Fixed $15 Platform Fee Transactions) */}
        {currentTab === 'marketplace' && (
          <MarketplaceView
            artworks={artworks}
            profiles={profiles}
            orders={orders}
            onSelectArtwork={handleInspectArtwork}
            onBuyArtwork={handleOpenCheckoutForArtwork}
            onViewProfile={handleViewArtistProfile}
          />
        )}

        {/* TAB 3: RESIDENT ARTISTS DIRECTORY */}
        {currentTab === 'artists' && (
          <ArtistsDirectoryView
            profiles={profiles}
            artworks={artworks}
            onViewProfile={handleViewArtistProfile}
            onOpenCommission={handleOpenCommissionModalForArtist}
          />
        )}

        {/* TAB 4: USER PROFILE & STUDIO */}
        {currentTab === 'my-profile' && (
          <UserProfileView
            profile={activeProfile}
            currentUser={currentUser}
            artworks={artworks}
            commissionRequests={commissions}
            orders={orders}
            onOpenCommissionModal={handleOpenCommissionModalForArtist}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenUploadToProfile={(cat) => {
              setUploadCategory(cat);
              setIsSubmitOpen(true);
            }}
            onSelectArtwork={handleInspectArtwork}
            onSwitchProfile={handleSwitchActiveProfile}
            onAcceptCommission={handleAcceptCommission}
            onDeclineCommission={handleDeclineCommission}
            onCompleteCommission={handleCompleteCommission}
            allProfiles={profiles}
          />
        )}
      </main>

      {/* MODALS */}

      {/* 1. Artwork Detail & Museum Plaque Inspector */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onLike={handleLike}
        onAddComment={handleAddComment}
        onInquireSale={handleInquireSale}
        onBuyArtwork={handleOpenCheckoutForArtwork}
        onViewArtistProfile={handleViewArtistProfile}
      />

      {/* 2. Submit / Exhibit Artwork Modal */}
      <SubmitArtworkModal
        isOpen={isSubmitOpen}
        onClose={() => {
          setIsSubmitOpen(false);
          setUploadCategory(undefined);
        }}
        onSubmit={handleSubmitNewArtwork}
        onOpenDrawingStudio={() => {
          setIsSubmitOpen(false);
          setIsDrawingStudioOpen(true);
        }}
        prefilledImage={prefilledCanvasImage}
        currentUser={currentUser}
        initialCategory={uploadCategory}
        onCategoryAdded={handleCategoryAddedToProfile}
      />

      {/* 3. Drawing Studio Canvas Modal */}
      <DrawingStudioModal
        isOpen={isDrawingStudioOpen}
        onClose={() => setIsDrawingStudioOpen(false)}
        onArtworkReady={handleDrawingReady}
      />

      {/* 4. Artist Dashboard Modal (Exhibition passes and fees) */}
      <ArtistDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        artworks={artworks}
        onSelectArtwork={handleInspectArtwork}
        onUpgradeTier={handleUpgradeTier}
        onOpenSubmit={() => {
          setIsDashboardOpen(false);
          setIsSubmitOpen(true);
        }}
      />

      {/* 5. Custom Artwork Commission Request Modal */}
      {commissionTargetArtist && (
        <CommissionModal
          isOpen={!!commissionTargetArtist}
          onClose={() => setCommissionTargetArtist(null)}
          artist={commissionTargetArtist}
          currentUser={currentUser}
          onRequestSubmitted={handleCommissionSubmitted}
        />
      )}

      {/* 6. Marketplace Secure Checkout Modal (Fixed $15 Fee Guarantee) */}
      {checkoutArtwork && (
        <MarketplaceCheckoutModal
          isOpen={!!checkoutArtwork}
          onClose={() => setCheckoutArtwork(null)}
          artwork={checkoutArtwork}
          currentUser={currentUser}
          onOrderCompleted={handleOrderCompleted}
        />
      )}

      {/* 7. Edit Profile & Commission Rates Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={currentUser}
        onSave={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-sm font-bold text-zinc-300">
              PhoenixStudios
            </span>
            <span>• Verified Art Sharing, Marketplace & Commission Studio</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Fixed $15 Platform Fee Guaranteed
            </span>
            <span>256-Bit Escrow Vault</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

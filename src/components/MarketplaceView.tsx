import React, { useState } from 'react';
import { Artwork, UserProfile, MarketplaceOrder } from '../types';
import {
  ShoppingBag,
  ShieldCheck,
  DollarSign,
  Filter,
  CheckCircle2,
  Tag,
  ArrowRight,
  Search,
  Sparkles,
  Lock
} from 'lucide-react';

interface MarketplaceViewProps {
  artworks: Artwork[];
  profiles: UserProfile[];
  orders: MarketplaceOrder[];
  onSelectArtwork: (artwork: Artwork) => void;
  onBuyArtwork: (artwork: Artwork) => void;
  onViewProfile: (artistId: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  artworks,
  profiles,
  orders,
  onSelectArtwork,
  onBuyArtwork,
  onViewProfile
}) => {
  const [filterMedium, setFilterMedium] = useState<string>('all');
  const [filterPriceRange, setFilterPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSold, setShowSold] = useState(true);

  // Filter artworks listed for sale
  const saleArtworks = artworks.filter((a) => a.isForSale && a.salePrice);

  const filtered = saleArtworks.filter((art) => {
    if (!showSold && art.isSold) return false;
    if (filterMedium !== 'all' && art.medium !== filterMedium) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchArtist = art.artistName.toLowerCase().includes(q);
      const matchCat = art.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchArtist && !matchCat) return false;
    }
    if (filterPriceRange === 'under1000' && (art.salePrice || 0) >= 1000) return false;
    if (
      filterPriceRange === '1000to2000' &&
      ((art.salePrice || 0) < 1000 || (art.salePrice || 0) > 2000)
    )
      return false;
    if (filterPriceRange === 'over2000' && (art.salePrice || 0) <= 2000) return false;

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Marketplace Hero & Fixed Fee Guarantee */}
      <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-md flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> PhoenixStudios Marketplace
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {saleArtworks.length} Verified Originals Listed
            </span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Curated Originals & Certified Acquisitions
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            Acquire original fine art and digital masterworks directly from resident studio artists. Every acquisition is backed by our verified escrow protocol with a flat, transparent platform fee structure.
          </p>

          {/* Fixed Platform Fee Banner */}
          <div className="pt-2">
            <div className="p-3.5 bg-zinc-900/90 border border-amber-400/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Fixed Platform Fee Guarantee:</strong> Only a flat <strong>$15.00</strong> fee is deducted per successful sale from artist earnings. 100% of the remaining purchase goes directly to the creator.
                </span>
              </div>
              <span className="font-mono text-emerald-400 text-[11px] font-semibold whitespace-nowrap bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                Zero Variable Percentage Cuts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by artwork, artist, or style..."
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-hidden focus:border-amber-400 placeholder:text-zinc-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterMedium}
            onChange={(e) => setFilterMedium(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-hidden"
          >
            <option value="all">All Mediums</option>
            <option value="Oil on Canvas">Oil on Canvas</option>
            <option value="Digital Painting">Digital Painting</option>
            <option value="Mixed Media">Mixed Media</option>
            <option value="Watercolor & Ink">Watercolor & Ink</option>
          </select>

          <select
            value={filterPriceRange}
            onChange={(e) => setFilterPriceRange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-hidden"
          >
            <option value="all">All Prices</option>
            <option value="under1000">Under $1,000</option>
            <option value="1000to2000">$1,000 – $2,000</option>
            <option value="over2000">$2,000+</option>
          </select>

          <label className="flex items-center gap-1.5 text-zinc-400 text-xs cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={showSold}
              onChange={(e) => setShowSold(e.target.checked)}
              className="accent-amber-400 rounded"
            />
            <span>Include Sold</span>
          </label>
        </div>
      </div>

      {/* Marketplace Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art) => {
          const artistProfile = profiles.find(
            (p) => p.id === art.artistId || p.username === art.artistUsername
          );
          const price = art.salePrice || 0;
          const artistNet = Math.max(0, price - 15);

          return (
            <div
              key={art.id}
              className="bg-zinc-950 border border-zinc-800 hover:border-amber-400/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Artwork Image & Status */}
              <div
                className="relative aspect-4/3 overflow-hidden bg-zinc-900 cursor-pointer"
                onClick={() => onSelectArtwork(art)}
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {art.category && (
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-zinc-700 text-zinc-300 text-[10px] rounded font-medium">
                      {art.category}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-zinc-700 text-zinc-300 text-[10px] rounded font-mono">
                    {art.medium}
                  </span>
                </div>

                {art.isSold ? (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="px-4 py-1.5 bg-rose-500/90 text-white font-serif-display text-sm font-bold tracking-widest uppercase border border-rose-400 rotate-[-6deg] shadow-2xl">
                      Sold & Collected
                    </span>
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-zinc-950/90 border border-amber-400/60 text-amber-400 font-mono text-sm font-bold rounded-lg shadow-lg">
                      ${price.toLocaleString()} USD
                    </span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    onClick={() => onSelectArtwork(art)}
                    className="font-serif-display text-lg font-bold text-zinc-100 hover:text-amber-400 cursor-pointer transition-colors truncate"
                  >
                    {art.title}
                  </h3>

                  <div className="flex items-center justify-between mt-1.5">
                    <button
                      type="button"
                      onClick={() => onViewProfile(art.artistId)}
                      className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {artistProfile?.avatarUrl && (
                        <img
                          src={artistProfile.avatarUrl}
                          alt={art.artistName}
                          className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                        />
                      )}
                      <span>by {art.artistName}</span>
                    </button>

                    <span className="text-[11px] text-zinc-500 font-mono">
                      {art.year} • {art.dimensions || 'Archival'}
                    </span>
                  </div>
                </div>

                {/* Fixed Fee Calculation & Acquire Action */}
                <div className="pt-3 border-t border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>Fixed Platform Fee: -$15</span>
                    <span className="text-emerald-400">Creator nets ${artistNet.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectArtwork(art)}
                      className="flex-1 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-colors"
                    >
                      Examine Details
                    </button>

                    {art.isSold ? (
                      <span className="px-4 py-2 text-xs font-medium text-zinc-500 bg-zinc-900 rounded-xl border border-zinc-850 text-center">
                        Acquired
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onBuyArtwork(art)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow transition-all hover:scale-102"
                      >
                        <Lock className="w-3.5 h-3.5" /> Acquire (${price})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Marketplace Transactions Stream */}
      {orders.length > 0 && (
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Escrow Transactions
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              Secure Ledger Updates in Real-time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {orders.slice(0, 6).map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-zinc-900/70 border border-zinc-850 rounded-xl flex items-center gap-3 text-xs"
              >
                <img
                  src={ord.artworkImageUrl}
                  alt={ord.artworkTitle}
                  className="w-11 h-11 object-cover rounded-lg border border-zinc-700 shrink-0"
                />
                <div className="min-w-0">
                  <span className="font-bold text-zinc-200 block truncate font-serif-display">
                    {ord.artworkTitle}
                  </span>
                  <span className="text-zinc-400 text-[11px] block">
                    Acquired by {ord.buyerName}
                  </span>
                  <span className="font-mono text-emerald-400 text-[10px]">
                    ${ord.salePrice} (Artist earned ${ord.artistEarnings})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

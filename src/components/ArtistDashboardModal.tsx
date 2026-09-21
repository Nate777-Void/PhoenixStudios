import React from 'react';
import { Artwork, ExhibitionTierId } from '../types';
import { GET_TIER } from '../data/tiers';
import {
  X,
  Plus,
  Eye,
  Heart,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

interface ArtistDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  artworks: Artwork[];
  onOpenSubmit: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
  onUpgradeTier: (artworkId: string, newTier: ExhibitionTierId) => void;
}

export const ArtistDashboardModal: React.FC<ArtistDashboardModalProps> = ({
  isOpen,
  onClose,
  artworks,
  onOpenSubmit,
  onSelectArtwork,
  onUpgradeTier
}) => {
  if (!isOpen) return null;

  const userArtworks = artworks.filter((a) => a.isUserSubmission || true); // show all active exhibits in dashboard

  const totalFeesInvested = artworks.reduce((acc, curr) => acc + curr.displayFeePaid, 0);
  const totalLikes = artworks.reduce((acc, curr) => acc + curr.likes, 0);
  const totalViews = artworks.reduce((acc, curr) => acc + curr.views, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="artist-studio-dashboard"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-zinc-100">
                Artist Studio & Exhibition Manager
              </h2>
              <p className="text-xs text-zinc-400">
                Manage your active gallery displays, exhibition fees, and visitor engagement
              </p>
            </div>
          </div>
          <button
            id="close-artist-dashboard-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Metrics Overview */}
        <div className="p-6 bg-zinc-950/60 border-b border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Exhibition Fees Invested</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-amber-400">
                ${totalFeesInvested}.00
              </span>
              <span className="text-[11px] text-zinc-500">across {artworks.length} pieces</span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Total Gallery Admirations</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-rose-400 flex items-center gap-1">
                <Heart className="w-5 h-5 fill-rose-500" /> {totalLikes}
              </span>
              <span className="text-[11px] text-zinc-500">visitor likes</span>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
            <span className="text-xs text-zinc-400 font-medium">Cumulative Visitors</span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-sky-400 flex items-center gap-1">
                <Eye className="w-5 h-5" /> {totalViews}
              </span>
              <span className="text-[11px] text-zinc-500">impressions</span>
            </div>
          </div>
        </div>

        {/* Artworks List & Actions */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-lg font-bold text-zinc-200">
              Active Displays ({artworks.length})
            </h3>
            <button
              id="dashboard-submit-new-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenSubmit();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-colors"
            >
              <Plus className="w-4 h-4" /> Exhibit New Artwork
            </button>
          </div>

          <div className="space-y-3">
            {artworks.map((art) => {
              const tier = GET_TIER(art.displayTier);
              return (
                <div
                  key={art.id}
                  className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-16 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif-display text-base font-bold text-zinc-100 truncate">
                          {art.title}
                        </h4>
                        <span
                          className="px-2 py-0.5 text-[10px] font-bold uppercase rounded"
                          style={{
                            backgroundColor: `${tier.accentColor}20`,
                            color: tier.accentColor,
                            border: `1px solid ${tier.accentColor}40`
                          }}
                        >
                          {tier.name}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {art.medium} • Pass: {art.exhibitionPassId}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-400" /> {art.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-zinc-400" /> {art.views}
                        </span>
                        <span className="text-amber-400/90 font-semibold">
                          Fee Paid: ${art.displayFeePaid}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {art.displayTier !== 'grand_salon' && (
                      <button
                        type="button"
                        onClick={() => onUpgradeTier(art.id, 'grand_salon')}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg transition-colors flex items-center gap-1"
                        title="Upgrade to Grand Curator's Hall for the fee difference"
                      >
                        <Sparkles className="w-3 h-3" /> Upgrade to Grand Hall (+$20)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectArtwork(art);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      View on Wall <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All artworks are verified under the Curatorial Display Charter.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

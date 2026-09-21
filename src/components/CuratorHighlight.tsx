import React from 'react';
import { Artwork } from '../types';
import { Sparkles, Heart, Eye, ArrowRight } from 'lucide-react';

interface CuratorHighlightProps {
  artwork: Artwork | null;
  onSelect: (artwork: Artwork) => void;
  onExhibitArt: () => void;
}

export const CuratorHighlight: React.FC<CuratorHighlightProps> = ({
  artwork,
  onSelect,
  onExhibitArt
}) => {
  if (!artwork) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 p-6 sm:p-8 shadow-2xl mb-10">
      {/* Top Gold Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Text & Curatorial Distinction */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/15 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Curator's Rotunda Centerpiece • $35 Exhibition Placement
          </div>

          <div>
            <h2 className="font-serif-display text-2xl sm:text-4xl font-bold text-zinc-100 leading-tight">
              {artwork.title}
            </h2>
            <p className="font-serif-display italic text-base sm:text-lg text-amber-300/90 mt-1">
              Presented by {artwork.artistName} ({artwork.year})
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed max-w-2xl font-sans">
            {artwork.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <button
              id="view-featured-centerpiece-btn"
              type="button"
              onClick={() => onSelect(artwork)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Inspect Masterpiece <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="exhibit-in-rotunda-btn"
              type="button"
              onClick={onExhibitArt}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-800/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl font-medium transition-colors"
            >
              Exhibit Your Artwork Here
            </button>
          </div>
        </div>

        {/* Right: Framed artwork presentation */}
        <div
          onClick={() => onSelect(artwork)}
          className="lg:col-span-5 flex justify-center cursor-pointer group"
        >
          <div className="relative p-3 bg-gradient-to-tr from-[#947827] via-[#f7d984] to-[#b8972b] rounded-xs shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-xs sm:max-w-sm w-full transition-transform duration-300 group-hover:scale-102">
            {/* Inner mat */}
            <div className="p-2 bg-[#f6f3eb] shadow-inner">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-950">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            {/* Attached Brass Plaque */}
            <div className="mt-2 text-center py-1 bg-amber-200/90 text-zinc-950 rounded-xs font-serif-display text-xs font-bold truncate">
              {artwork.title} — {artwork.artistName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Artwork } from '../types';
import { GET_TIER } from '../data/tiers';
import { Eye, Heart, Sparkles } from 'lucide-react';

interface ArtFrameProps {
  artwork: Artwork;
  onClick?: () => void;
  showPlaque?: boolean;
  priority?: boolean;
}

export const ArtFrame: React.FC<ArtFrameProps> = ({
  artwork,
  onClick,
  showPlaque = true,
  priority = false
}) => {
  const tier = GET_TIER(artwork.displayTier);

  // Dynamic frame outer styling
  const getFrameContainerStyle = () => {
    switch (artwork.frameStyle) {
      case 'gold':
        return 'p-3.5 sm:p-4 bg-gradient-to-tr from-[#947827] via-[#e5c07b] to-[#b8972b] shadow-[0_15px_35px_rgba(0,0,0,0.8),0_5px_15px_rgba(212,175,55,0.2)] rounded-xs border-2 border-[#7a5f18]';
      case 'matte-black':
        return 'p-3.5 sm:p-4 bg-zinc-950 shadow-[0_15px_35px_rgba(0,0,0,0.85)] border-4 border-zinc-800 rounded-xs';
      case 'white-oak':
        return 'p-3.5 sm:p-4 bg-[#c8b39b] shadow-[0_15px_30px_rgba(0,0,0,0.7)] border-2 border-[#a89279] rounded-xs';
      case 'float':
        return 'p-2 sm:p-2.5 bg-zinc-900 shadow-[0_20px_40px_rgba(0,0,0,0.9)] border border-zinc-700/80 rounded-xs';
      case 'minimal':
      default:
        return 'p-1 bg-zinc-800 shadow-[0_15px_25px_rgba(0,0,0,0.75)] border border-zinc-700 rounded-xs';
    }
  };

  // Inner matboard styling
  const getMatStyle = () => {
    switch (artwork.frameStyle) {
      case 'gold':
        return 'p-2 sm:p-3 bg-[#f7f5ed] shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] border border-[#d5cbaf]';
      case 'matte-black':
        return 'p-2 sm:p-3 bg-[#fafafa] shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] border border-zinc-300';
      case 'white-oak':
        return 'p-2 sm:p-3 bg-[#fdfbf7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] border border-[#ece4d6]';
      case 'float':
        return 'p-1.5 bg-[#17171a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]';
      case 'minimal':
      default:
        return 'p-0';
    }
  };

  // Museum Plaque style based on exhibition tier
  const getPlaqueStyle = () => {
    switch (artwork.displayTier) {
      case 'grand_salon':
        return 'plaque-brass';
      case 'spotlight':
        return 'plaque-silver';
      case 'standard':
      default:
        return 'plaque-ebony';
    }
  };

  return (
    <div
      id={`artwork-card-${artwork.id}`}
      onClick={onClick}
      className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
        priority ? 'transform-none' : 'hover:-translate-y-1.5'
      }`}
    >
      {/* Overhead Gallery Spotlight (For Grand Salon and Spotlight tiers) */}
      {artwork.displayTier === 'grand_salon' && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          {/* Brass Light Bar */}
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#947827] via-[#fed476] to-[#947827] rounded-full shadow-md" />
          <div className="w-2.5 h-3 bg-[#7a5f18] -mt-0.5" />
          {/* Luminous Light Beam */}
          <div className="w-48 sm:w-64 h-24 bg-gradient-to-b from-amber-200/25 via-amber-200/5 to-transparent blur-md -mt-1 transform origin-top" />
        </div>
      )}

      {artwork.displayTier === 'spotlight' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          <div className="w-12 h-1 bg-gradient-to-r from-zinc-500 via-sky-300 to-zinc-500 rounded-full shadow-sm" />
          <div className="w-36 h-16 bg-gradient-to-b from-sky-200/15 to-transparent blur-sm -mt-0.5" />
        </div>
      )}

      {/* Frame Container */}
      <div
        className={`w-full relative transition-all duration-300 ${getFrameContainerStyle()} ${
          artwork.displayTier === 'grand_salon' ? 'gallery-spotlight-gold' : 'gallery-spotlight-soft'
        }`}
      >
        {/* Tier Stamp on Top Corner */}
        <div className="absolute top-2 right-2 z-20 pointer-events-none">
          {artwork.displayTier === 'grand_salon' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-400 text-zinc-950 rounded-sm shadow-md">
              <Sparkles className="w-3 h-3 text-amber-950 fill-amber-950" />
              Grand Salon
            </span>
          )}
          {artwork.displayTier === 'spotlight' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-sky-400 text-zinc-950 rounded-sm shadow-md">
              Salon Spotlight
            </span>
          )}
        </div>

        {/* Matboard Area */}
        <div className={`w-full overflow-hidden ${getMatStyle()}`}>
          {/* Image Canvas */}
          <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full overflow-hidden bg-zinc-900 group-hover:scale-[1.01] transition-transform duration-500">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover object-center select-none"
              loading="lazy"
              onError={(e) => {
                // Graceful fallback visual
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Subtle Vignette & Glaze */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

            {/* Quick Interactive Hover Bar */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <span className="px-2 py-1 text-xs font-medium bg-black/75 backdrop-blur-sm text-zinc-200 rounded">
                Click to inspect
              </span>
              <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-black/75 backdrop-blur-sm text-zinc-200 rounded">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>{artwork.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Museum Plaque Mounted Below */}
      {showPlaque && (
        <div
          className={`mt-3.5 w-11/12 max-w-[280px] p-2.5 rounded text-center transition-all ${getPlaqueStyle()}`}
        >
          <h4 className="font-serif-display text-base font-bold tracking-wide leading-tight truncate">
            {artwork.title}
          </h4>
          <p className="text-xs opacity-90 font-medium mt-0.5 truncate">
            {artwork.artistName} <span className="opacity-60">• {artwork.year}</span>
          </p>
          <div className="flex items-center justify-between text-[10px] mt-1.5 pt-1.5 border-t border-black/15 font-mono">
            <span className="truncate">{artwork.medium}</span>
            <span className="font-semibold tracking-wide">
              {artwork.isForSale && artwork.salePrice ? `$${artwork.salePrice.toLocaleString()}` : 'Exhibition'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

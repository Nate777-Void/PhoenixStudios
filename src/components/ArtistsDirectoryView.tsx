import React from 'react';
import { UserProfile, Artwork } from '../types';
import { Sparkles, MapPin, CheckCircle2, Clock, ArrowRight, Layers, DollarSign } from 'lucide-react';

interface ArtistsDirectoryViewProps {
  profiles: UserProfile[];
  artworks: Artwork[];
  onViewProfile: (artistId: string) => void;
  onOpenCommission: (artist: UserProfile) => void;
}

export const ArtistsDirectoryView: React.FC<ArtistsDirectoryViewProps> = ({
  profiles,
  artworks,
  onViewProfile,
  onOpenCommission
}) => {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2 relative">
          <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-md">
            PhoenixStudios Roster
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Resident Studio Artists
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            Connect directly with verified master painters, digital concept artists, and printmakers. Explore their curated personal galleries or commission custom original artwork.
          </p>
        </div>
      </div>

      {/* Artists Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((artist) => {
          const artistPieces = artworks.filter(
            (a) => a.artistId === artist.id || a.artistUsername === artist.username
          );
          const isAvailable = artist.commissionSettings.acceptingCommissions;

          return (
            <div
              key={artist.id}
              className="bg-zinc-950 border border-zinc-800 hover:border-amber-400/40 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Header Banner & Avatar */}
              <div className="relative h-28 bg-zinc-900 overflow-hidden">
                <img
                  src={
                    artist.bannerUrl ||
                    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={artist.displayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              </div>

              <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                {/* Profile Avatar & Names */}
                <div className="flex items-start gap-4 -mt-10">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.displayName}
                    className="w-18 h-18 rounded-2xl object-cover border-3 border-zinc-950 shadow-xl ring-2 ring-amber-400/30"
                  />
                  <div className="pt-2 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3
                        onClick={() => onViewProfile(artist.id)}
                        className="font-serif-display text-lg font-bold text-zinc-100 hover:text-amber-400 cursor-pointer transition-colors truncate"
                      >
                        {artist.displayName}
                      </h3>
                      <span className="text-[11px] font-mono text-amber-400">
                        @{artist.username}
                      </span>
                    </div>

                    {artist.location && (
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        <span>{artist.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio & Specialties */}
                <div className="space-y-2">
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {artist.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {artist.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] rounded-md font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Artwork Thumbnail Strip */}
                {artistPieces.length > 0 && (
                  <div className="pt-2 border-t border-zinc-900">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                      Gallery Preview ({artistPieces.length} Works):
                    </span>
                    <div className="flex items-center gap-2 overflow-hidden">
                      {artistPieces.slice(0, 4).map((piece) => (
                        <img
                          key={piece.id}
                          src={piece.imageUrl}
                          alt={piece.title}
                          title={piece.title}
                          onClick={() => onViewProfile(artist.id)}
                          className="w-14 h-14 object-cover rounded-lg border border-zinc-800 cursor-pointer hover:border-amber-400 transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Commission Rates & Availability Bar */}
                <div className="p-3 bg-zinc-900/70 border border-zinc-850 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        artist.commissionSettings.availabilityStatus === 'Open'
                          ? 'bg-emerald-400 animate-pulse'
                          : artist.commissionSettings.availabilityStatus === 'Limited Slots'
                          ? 'bg-amber-400'
                          : 'bg-zinc-500'
                      }`}
                    />
                    <span className="text-zinc-300 font-medium">
                      {artist.commissionSettings.availabilityStatus}
                    </span>
                  </div>

                  <span className="font-mono text-amber-400 font-bold">
                    From ${artist.commissionSettings.baseRate} USD
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile(artist.id)}
                    className="flex-1 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-colors"
                  >
                    View Studio Profile & Gallery
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenCommission(artist)}
                    disabled={!isAvailable}
                    className="px-4 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Commission
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

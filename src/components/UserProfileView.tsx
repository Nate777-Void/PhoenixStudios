import React, { useState } from 'react';
import { UserProfile, Artwork, CommissionRequest, MarketplaceOrder } from '../types';
import { ArtFrame } from './ArtFrame';
import {
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Edit3,
  ShieldCheck,
  Tag,
  Wallet,
  ShoppingBag,
  ArrowRight,
  UserCheck,
  Layers,
  Heart
} from 'lucide-react';

interface UserProfileViewProps {
  profile: UserProfile;
  currentUser: UserProfile;
  artworks: Artwork[];
  commissionRequests: CommissionRequest[];
  orders: MarketplaceOrder[];
  onOpenCommissionModal: (artist: UserProfile) => void;
  onOpenEditProfile: () => void;
  onOpenUploadToProfile: (category?: string) => void;
  onSelectArtwork: (artwork: Artwork) => void;
  onSwitchProfile: (profileId: string) => void;
  onAcceptCommission: (requestId: string, note?: string) => void;
  onDeclineCommission: (requestId: string) => void;
  onCompleteCommission: (requestId: string) => void;
  allProfiles: UserProfile[];
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  profile,
  currentUser,
  artworks,
  commissionRequests,
  orders,
  onOpenCommissionModal,
  onOpenEditProfile,
  onOpenUploadToProfile,
  onSelectArtwork,
  onSwitchProfile,
  onAcceptCommission,
  onDeclineCommission,
  onCompleteCommission,
  allProfiles
}) => {
  const isOwnProfile = profile.id === currentUser.id;
  const [activeTab, setActiveTab] = useState<'gallery' | 'commissions' | 'wallet'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [commissionResponseNote, setCommissionResponseNote] = useState<{ [id: string]: string }>({});

  // Filter artist's artworks
  const artistArtworks = artworks.filter(
    (a) => a.artistId === profile.id || a.artistUsername === profile.username
  );

  const displayedArtworks = artistArtworks.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  // Artist's incoming commission requests
  const artistCommissions = commissionRequests.filter((c) => c.artistId === profile.id);

  // Artist's completed sales
  const artistOrders = orders.filter((o) => o.artistId === profile.id);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Profile Banner & Header */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
        {/* Banner Image */}
        <div className="h-44 sm:h-56 w-full relative overflow-hidden bg-zinc-900">
          <img
            src={
              profile.bannerUrl ||
              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Profile Banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar & Main Info */}
            <div className="flex items-end gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-zinc-950 shadow-2xl ring-2 ring-amber-400/40"
                />
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-zinc-950 flex items-center justify-center bg-amber-400 text-zinc-950 shadow"
                  title="Verified PhoenixStudios Resident Artist"
                >
                  <Sparkles className="w-3 h-3 fill-zinc-950" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-zinc-100">
                    {profile.displayName}
                  </h1>
                  <span className="text-xs text-amber-400 font-mono font-medium">
                    @{profile.username}
                  </span>
                </div>

                {profile.location && (
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{profile.location}</span>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {profile.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-medium rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions (Commission, Edit, Switch Profile) */}
            <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto justify-end">
              {isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenEditProfile}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-colors shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit Profile & Rates
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenUploadToProfile(selectedCategory !== 'All' ? selectedCategory : undefined)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload to Gallery
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenCommissionModal(profile)}
                    disabled={!profile.commissionSettings.acceptingCommissions}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Request Custom Commission
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchProfile(profile.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
                    title="Switch active user to this artist profile"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Act as this Artist</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Artist Bio */}
          <div className="mt-5 max-w-3xl">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {profile.bio}
            </p>
          </div>

          {/* Metrics & Commission Status Ribbon */}
          <div className="mt-6 pt-5 border-t border-zinc-850 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <span className="text-[11px] text-zinc-400 block">Commission Availability</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    profile.commissionSettings.availabilityStatus === 'Open'
                      ? 'bg-emerald-400 animate-pulse'
                      : profile.commissionSettings.availabilityStatus === 'Limited Slots'
                      ? 'bg-amber-400'
                      : 'bg-zinc-500'
                  }`}
                />
                <span className="font-semibold text-xs text-zinc-100">
                  {profile.commissionSettings.availabilityStatus}
                </span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <span className="text-[11px] text-zinc-400 block">Commission Base Rate</span>
              <span className="font-mono text-xs font-bold text-amber-400 mt-1 block">
                Starting at ${profile.commissionSettings.baseRate} USD
              </span>
            </div>

            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <span className="text-[11px] text-zinc-400 block">Gallery Artworks</span>
              <span className="font-mono text-xs font-bold text-zinc-100 mt-1 block">
                {artistArtworks.length} Pieces Displayed
              </span>
            </div>

            <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl">
              <span className="text-[11px] text-zinc-400 block">Marketplace Sales</span>
              <span className="font-mono text-xs font-bold text-emerald-400 mt-1 block">
                {profile.stats.totalSales} Works Acquired
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'gallery'
                ? 'bg-zinc-800 text-amber-400 border border-amber-400/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Gallery & Collections ({artistArtworks.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('commissions')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'commissions'
                ? 'bg-zinc-800 text-amber-400 border border-amber-400/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Commission Services ({profile.commissionSettings.serviceTiers.length})
            {artistCommissions.filter((c) => c.status === 'pending').length > 0 && isOwnProfile && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                activeTab === 'wallet'
                  ? 'bg-zinc-800 text-amber-400 border border-amber-400/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Artist Wallet (${profile.walletBalance.toLocaleString()})
            </button>
          )}
        </div>

        {/* Quick switch artist preview selector */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <span>Switch Artist:</span>
          <select
            value={profile.id}
            onChange={(e) => onSwitchProfile(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-hidden cursor-pointer"
          >
            {allProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName} (@{p.username})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: GALLERY & ARTWORK CATEGORIES */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-zinc-500 font-medium mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Categories:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-1.5 rounded-full transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                All Pieces ({artistArtworks.length})
              </button>

              {profile.categories.map((cat) => {
                const count = artistArtworks.filter((a) => a.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {isOwnProfile && (
              <button
                type="button"
                onClick={() => onOpenUploadToProfile(selectedCategory !== 'All' ? selectedCategory : undefined)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Upload to {selectedCategory !== 'All' ? `"${selectedCategory}"` : 'Gallery'}
              </button>
            )}
          </div>

          {/* Artworks Display Grid */}
          {displayedArtworks.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-zinc-950/60 border border-zinc-800 rounded-2xl">
              <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="font-serif-display text-lg font-bold text-zinc-300">
                No artworks in this category yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {isOwnProfile
                  ? 'Upload your paintings, sketches, or digital studies to populate this collection.'
                  : 'This artist has not yet added pieces to this specific category.'}
              </p>
              {isOwnProfile && (
                <button
                  type="button"
                  onClick={() => onOpenUploadToProfile(selectedCategory !== 'All' ? selectedCategory : undefined)}
                  className="px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  Upload Artwork Now
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedArtworks.map((art) => (
                <div key={art.id} className="relative group">
                  <ArtFrame
                    artwork={art}
                    onClick={() => onSelectArtwork(art)}
                    showPlaque={true}
                  />
                  {/* Category Pill Tag */}
                  {art.category && (
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-zinc-700 text-zinc-300 text-[10px] rounded-md font-medium">
                        {art.category}
                      </span>
                    </div>
                  )}

                  {/* Sold Status Overlay */}
                  {art.isSold && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xs flex items-center justify-center pointer-events-none z-20">
                      <div className="px-4 py-1.5 bg-rose-500/90 text-white font-serif-display text-sm font-bold tracking-widest uppercase border border-rose-400 shadow-xl rotate-[-6deg]">
                        Sold / In Collection
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMMISSION SERVICES & INCOMING REQUESTS */}
      {activeTab === 'commissions' && (
        <div className="space-y-8">
          {/* Artist's Service Tiers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-zinc-100">
                  Commission Service Menu
                </h3>
                <p className="text-xs text-zinc-400">
                  Custom bespoke artwork tiers offered by {profile.displayName}
                </p>
              </div>
              {!isOwnProfile && (
                <button
                  type="button"
                  onClick={() => onOpenCommissionModal(profile)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Request Bespoke Commission
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.commissionSettings.serviceTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-md hover:border-amber-400/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                        Commission Tier
                      </span>
                      <span className="font-mono text-lg font-bold text-zinc-100">
                        ${tier.price}
                      </span>
                    </div>
                    <h4 className="font-serif-display text-lg font-bold text-zinc-100 mt-1">
                      {tier.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {tier.turnaround}
                    </span>
                    {!isOwnProfile && (
                      <button
                        type="button"
                        onClick={() => onOpenCommissionModal(profile)}
                        className="text-xs font-semibold text-amber-400 hover:underline"
                      >
                        Request This Tier →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incoming Commission Proposals (Artist Management Studio) */}
          {isOwnProfile && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-zinc-100">
                    Incoming Commission Proposals ({artistCommissions.length})
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Review specifications from prospective collectors, accept or decline offers
                  </p>
                </div>
              </div>

              {artistCommissions.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center bg-zinc-950/60 border border-zinc-800 rounded-xl">
                  No active commission requests. Share your profile to invite collectors!
                </p>
              ) : (
                <div className="space-y-3">
                  {artistCommissions.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              req.status === 'pending'
                                ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                                : req.status === 'accepted'
                                ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30'
                                : req.status === 'completed'
                                ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {req.status}
                          </span>
                          <h4 className="font-serif-display text-base font-bold text-zinc-100">
                            {req.tierName}
                          </h4>
                          <span className="text-xs text-zinc-400 font-mono">
                            for {req.buyerName} ({req.buyerEmail})
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="text-amber-400 font-bold text-sm">
                            ${req.budget} USD
                          </span>
                          <span className="text-zinc-500">Due: {req.deadline}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-900 rounded-lg text-xs text-zinc-300 leading-relaxed border border-zinc-800">
                        <span className="font-semibold text-zinc-400 block mb-0.5">
                          Collector's Creative Brief:
                        </span>
                        "{req.specifications}"
                      </div>

                      {req.artistNote && (
                        <p className="text-xs text-emerald-400 italic">
                          Artist Response: "{req.artistNote}"
                        </p>
                      )}

                      {/* Action buttons for pending/accepted commissions */}
                      {req.status === 'pending' && (
                        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-zinc-900">
                          <input
                            type="text"
                            placeholder="Optional note to collector upon accepting..."
                            value={commissionResponseNote[req.id] || ''}
                            onChange={(e) =>
                              setCommissionResponseNote({
                                ...commissionResponseNote,
                                [req.id]: e.target.value
                              })
                            }
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-200 flex-1 focus:outline-hidden focus:border-amber-400"
                          />
                          <div className="flex items-center gap-2 self-end">
                            <button
                              type="button"
                              onClick={() => onDeclineCommission(req.id)}
                              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onAcceptCommission(req.id, commissionResponseNote[req.id])
                              }
                              className="px-4 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accept Commission
                            </button>
                          </div>
                        </div>
                      )}

                      {req.status === 'accepted' && (
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-xs text-zinc-400">
                            Artwork in production. Mark completed once shipped/delivered.
                          </span>
                          <button
                            type="button"
                            onClick={() => onCompleteCommission(req.id)}
                            className="px-4 py-1.5 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                          >
                            Mark Completed & Release Funds
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ARTIST WALLET & MARKETPLACE PAYOUTS */}
      {activeTab === 'wallet' && isOwnProfile && (
        <div className="space-y-6">
          {/* Wallet Balance Hero */}
          <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-400/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> PhoenixStudios Artist Escrow Wallet
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-zinc-100">
                  ${profile.walletBalance.toLocaleString()}.00
                </span>
                <span className="text-xs text-zinc-400">Available Payout Balance</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-md">
                Net artist proceeds from sales (fixed $15 platform fee automatically deducted) and completed commission requests.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert(`Simulated payout of $${profile.walletBalance.toLocaleString()} initiated to bank account!`)}
                className="px-5 py-2.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all hover:scale-105"
              >
                Withdraw Funds to Bank
              </button>
            </div>
          </div>

          {/* Fixed Platform Fee Guarantee Box */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-xs">
            <h4 className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Fixed Platform Fee Policy
            </h4>
            <p className="text-zinc-400">
              PhoenixStudios operates on a transparent fixed-fee model: exactly <strong>$15.00</strong> is deducted from the gross sale price per acquired artwork to cover curatorial hosting, 256-bit payment encryption, and escrow guarantees. There are zero variable percentage deductions.
            </p>
          </div>

          {/* Sales History Ledger */}
          <div className="space-y-3">
            <h3 className="font-serif-display text-lg font-bold text-zinc-100">
              Completed Marketplace Transactions ({artistOrders.length})
            </h3>

            {artistOrders.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center bg-zinc-950/60 border border-zinc-800 rounded-xl">
                No marketplace sales yet. Once a collector acquires your listed art, the transaction receipt will appear here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {artistOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ord.artworkImageUrl}
                        alt={ord.artworkTitle}
                        className="w-12 h-12 object-cover rounded border border-zinc-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-zinc-200 block truncate">
                          {ord.artworkTitle}
                        </span>
                        <span className="text-zinc-500 text-[11px]">
                          Buyer: {ord.buyerName} • Ref: {ord.id}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-emerald-400 font-bold text-sm block">
                        +${ord.artistEarnings.toLocaleString()}.00
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Gross ${ord.salePrice} - Fixed Fee ${ord.platformFee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

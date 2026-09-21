import React, { useState } from 'react';
import { Artwork, ArtComment } from '../types';
import { GET_TIER } from '../data/tiers';
import {
  X,
  Heart,
  Eye,
  Calendar,
  Sparkles,
  Share2,
  Check,
  Send,
  DollarSign,
  User,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onAddComment: (artworkId: string, comment: Omit<ArtComment, 'id' | 'createdAt'>) => void;
  onInquireSale: (artworkId: string, offerAmount: number, buyerEmail: string) => void;
  onBuyArtwork?: (artwork: Artwork) => void;
  onViewArtistProfile?: (artistId: string) => void;
}

export const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({
  artwork,
  onClose,
  onLike,
  onAddComment,
  onInquireSale,
  onBuyArtwork,
  onViewArtistProfile
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState<'Visitor' | 'Collector' | 'Curator'>('Visitor');

  // Acquisition inquiry modal state
  const [showInquiry, setShowInquiry] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [offerPrice, setOfferPrice] = useState<number>(artwork?.salePrice || 0);
  const [inquirySent, setInquirySent] = useState(false);

  if (!artwork) return null;

  const tier = GET_TIER(artwork.displayTier);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(artwork.id, {
      author: commentAuthor.trim() || 'Gallery Visitor',
      role: commentRole,
      text: commentText.trim()
    });

    setCommentText('');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail.trim()) return;

    onInquireSale(artwork.id, offerPrice, buyerEmail);
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setShowInquiry(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div
        id="artwork-detail-dialog"
        className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
      >
        {/* Top Floating Control Bar */}
        <div className="px-6 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-sm"
              style={{
                backgroundColor: `${tier.accentColor}20`,
                color: tier.accentColor,
                border: `1px solid ${tier.accentColor}50`
              }}
            >
              {tier.hallName}
            </span>
            <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
              Pass: {artwork.exhibitionPassId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="share-artwork-btn"
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" /> Share
                </>
              )}
            </button>
            <button
              id="close-detail-modal-btn"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Artwork Presentation & Lighting */}
          <div className="lg:col-span-7 bg-zinc-950 p-6 sm:p-8 flex flex-col items-center justify-center relative border-b lg:border-b-0 lg:border-r border-zinc-800">
            {/* Gallery Overhead Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-300/10 blur-2xl pointer-events-none" />

            <div className="relative max-w-md w-full shadow-2xl">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full max-h-[60vh] object-contain rounded-xs shadow-2xl"
              />
            </div>

            {/* Quick Metrics & Actions beneath artwork */}
            <div className="mt-6 flex items-center gap-4">
              <button
                id="like-artwork-btn"
                type="button"
                onClick={() => onLike(artwork.id)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-800 rounded-xl text-zinc-200 transition-all group"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" />
                <span className="text-xs font-semibold">{artwork.likes} Admired</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-zinc-400 text-xs font-mono">
                <Eye className="w-4 h-4 text-zinc-500" />
                <span>{artwork.views} Gallery Views</span>
              </div>
            </div>
          </div>

          {/* Right Column: Curatorial Dossier, Exhibition Pass & Interactions */}
          <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Title & Artist */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight">
                    {artwork.title}
                  </h1>
                  {artwork.category && (
                    <span className="px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded-md font-mono shrink-0">
                      {artwork.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => onViewArtistProfile && artwork.artistId && onViewArtistProfile(artwork.artistId)}
                    className="text-base font-serif-display italic text-amber-400 hover:text-amber-300 hover:underline transition-colors flex items-center gap-1.5"
                  >
                    by {artwork.artistName}
                    <span className="text-xs font-sans not-italic text-zinc-500 hover:text-zinc-300">
                      (View Profile →)
                    </span>
                  </button>
                </div>
              </div>

              {/* Museum Specification Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-zinc-800 font-mono">
                <div>
                  <span className="text-zinc-500 block">Medium:</span>
                  <span className="text-zinc-200 font-sans">{artwork.medium}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Creation Year:</span>
                  <span className="text-zinc-200">{artwork.year}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Dimensions:</span>
                  <span className="text-zinc-200">{artwork.dimensions || 'Gallery Scale'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Framing:</span>
                  <span className="text-zinc-200 capitalize">{artwork.frameStyle}</span>
                </div>
              </div>

              {/* Exhibition Pass Card */}
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                    Official Exhibition Status
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active Exhibition
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300 pt-1 border-t border-zinc-900">
                  <span>Display Fee Paid:</span>
                  <span className="font-bold text-amber-400">${artwork.displayFeePaid}.00</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>Registered Pass ID:</span>
                  <span className="text-zinc-400">{artwork.exhibitionPassId}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span>Display Period:</span>
                  <span className="text-zinc-400">{artwork.displayDurationDays} Days</span>
                </div>
              </div>

              {/* Artist Statement / Curatorial Note */}
              <div>
                <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-1.5">
                  Curatorial Statement
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {artwork.description}
                </p>
                {artwork.artistBio && (
                  <p className="text-xs text-zinc-400 italic mt-2 border-l-2 border-amber-400/40 pl-2.5">
                    "{artwork.artistBio}"
                  </p>
                )}
              </div>

              {/* Marketplace Acquisition Section */}
              {artwork.isForSale && artwork.salePrice && (
                <div className="p-4 bg-zinc-950 border border-amber-500/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">
                        PhoenixStudios Marketplace Listing
                      </span>
                      <p className="font-mono text-2xl font-bold text-zinc-100 mt-0.5">
                        ${artwork.salePrice.toLocaleString()} USD
                      </p>
                    </div>

                    {artwork.isSold ? (
                      <span className="px-3.5 py-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold rounded-lg uppercase tracking-wider">
                        Sold / In Private Collection
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowInquiry(true)}
                          className="px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 rounded-lg transition-colors"
                        >
                          Inquire
                        </button>
                        {onBuyArtwork && (
                          <button
                            id="buy-artwork-now-btn"
                            type="button"
                            onClick={() => onBuyArtwork(artwork)}
                            className="px-4 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Buy Now ($15 Fixed Fee)
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {!artwork.isSold && (
                    <p className="text-[11px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800">
                      <span>Fixed Platform Fee: $15.00 deducted from artist</span>
                      <span className="text-emerald-400 font-mono font-medium">Artist nets ${(artwork.salePrice - 15).toLocaleString()}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Inquiry Modal Overlay */}
              {showInquiry && (
                <form
                  onSubmit={handleInquirySubmit}
                  className="p-4 bg-zinc-950 border border-amber-400/50 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Send Acquisition Inquiry
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowInquiry(false)}
                      className="text-zinc-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {inquirySent ? (
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5 py-2">
                      <CheckCircle2Icon /> Inquiry forwarded to artist & museum curator!
                    </p>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                          Your Email Address:
                        </label>
                        <input
                          type="email"
                          required
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="collector@gallery.art"
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                          Offer / Bid Amount ($USD):
                        </label>
                        <input
                          type="number"
                          value={offerPrice}
                          onChange={(e) => setOfferPrice(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 font-mono focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                      >
                        Submit Acquisition Inquiry
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Guestbook & Critiques Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
                    Guestbook & Critiques ({artwork.comments.length})
                  </h4>
                </div>

                {/* Comment list */}
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {artwork.comments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-2">
                      Be the first visitor to sign the guestbook for this piece.
                    </p>
                  ) : (
                    artwork.comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-200">
                              {c.author}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                c.role === 'Curator'
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : c.role === 'Collector'
                                  ? 'bg-purple-400/20 text-purple-300'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {c.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500">{c.createdAt}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Critique Form */}
                <form onSubmit={handleCommentSubmit} className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      placeholder="Your name"
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-hidden focus:border-amber-400"
                    />
                    <select
                      value={commentRole}
                      onChange={(e) => setCommentRole(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-hidden focus:border-amber-400"
                    >
                      <option value="Visitor">Visitor</option>
                      <option value="Collector">Collector</option>
                      <option value="Curator">Art Curator</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Leave a curatorial critique or note..."
                      className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg transition-colors"
                      title="Send critique"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CheckCircle2Icon() {
  return <Check className="w-4 h-4 text-emerald-400" />;
}

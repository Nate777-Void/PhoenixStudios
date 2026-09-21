import React, { useState } from 'react';
import { Artwork, ArtMedium, FrameStyle, ExhibitionTierId, UserProfile } from '../types';
import { EXHIBITION_TIERS, GET_TIER } from '../data/tiers';
import { ArtFrame } from './ArtFrame';
import {
  Upload,
  Paintbrush,
  Sparkles,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Tag,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubmitArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (artwork: Artwork) => void;
  onOpenDrawingStudio: () => void;
  prefilledImage?: string | null;
  currentUser?: UserProfile;
  initialCategory?: string;
  onCategoryAdded?: (category: string) => void;
}

const MEDIUMS: ArtMedium[] = [
  'Oil on Canvas',
  'Acrylic on Linen',
  'Digital Painting',
  'Mixed Media',
  'Watercolor & Ink',
  'Photography',
  'Charcoal & Pastel'
];

const FRAMES: { id: FrameStyle; label: string; desc: string }[] = [
  { id: 'gold', label: 'Gilded Baroque Gold', desc: 'Antique gold leaf bevel with warm archival mat' },
  { id: 'matte-black', label: 'Matte Ebony Wood', desc: 'Deep black gallery frame with crisp white border' },
  { id: 'white-oak', label: 'Scandinavian Oak', desc: 'Natural light oak wood with soft museum cream mat' },
  { id: 'float', label: 'Shadowbox Floating Canvas', desc: 'Raw canvas edge suspended in a deep dark tray' },
  { id: 'minimal', label: 'Modern Minimal Edge', desc: 'Fine bevel edge focusing purely on pigment' }
];

export const SubmitArtworkModal: React.FC<SubmitArtworkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onOpenDrawingStudio,
  prefilledImage,
  currentUser,
  initialCategory,
  onCategoryAdded
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState(currentUser?.displayName || 'Elena Vance');
  const [artistBio, setArtistBio] = useState(currentUser?.bio || '');
  const [artistContact, setArtistContact] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || currentUser?.categories?.[0] || 'Studio Highlights'
  );
  const [newCatInput, setNewCatInput] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  const [medium, setMedium] = useState<ArtMedium>('Oil on Canvas');
  const [dimensions, setDimensions] = useState('36 x 24 in');
  const [year, setYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(prefilledImage || '');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('gold');
  const [displayTier, setDisplayTier] = useState<ExhibitionTierId>('spotlight');
  const [isForSale, setIsForSale] = useState(true);
  const [salePrice, setSalePrice] = useState<number>(1200);

  // Payment Simulation State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9102');
  const [cardHolder, setCardHolder] = useState(currentUser?.displayName || 'Elena Vance');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [generatedPassId, setGeneratedPassId] = useState('');

  // Sync if prefilled image changes from drawing studio
  React.useEffect(() => {
    if (prefilledImage) {
      setImageUrl(prefilledImage);
    }
  }, [prefilledImage]);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  if (!isOpen) return null;

  const handleAddNewCategory = () => {
    if (!newCatInput.trim()) return;
    const cat = newCatInput.trim();
    if (onCategoryAdded) {
      onCategoryAdded(cat);
    }
    setSelectedCategory(cat);
    setNewCatInput('');
    setShowAddCat(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectedTierConfig = GET_TIER(displayTier);

  // Mock Artwork for live preview
  const previewArtwork: Artwork = {
    id: 'preview',
    title: title.trim() || 'Untitled Masterpiece',
    artistId: currentUser?.id || 'user-current',
    artistUsername: currentUser?.username || 'phoenix_artist',
    artistName: artistName.trim() || (currentUser?.displayName || 'Artist Name'),
    artistBio: artistBio.trim(),
    category: selectedCategory,
    description: description.trim() || 'Original artwork submitted for exhibition display.',
    medium,
    dimensions,
    year,
    imageUrl:
      imageUrl ||
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    frameStyle,
    isForSale,
    salePrice: isForSale ? salePrice : undefined,
    isSold: false,
    likes: 0,
    views: 1,
    displayTier,
    displayFeePaid: selectedTierConfig.fee,
    exhibitionPassId: 'EXH-PENDING',
    displayedAt: new Date().toISOString(),
    displayDurationDays: selectedTierConfig.durationDays,
    comments: [],
    isUserSubmission: true
  };

  const handlePayAndExhibit = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      const passId = `EXH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedPassId(passId);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      // Prepare final artwork object
      const finalArtwork: Artwork = {
        ...previewArtwork,
        id: `user-art-${Date.now()}`,
        exhibitionPassId: passId,
        displayedAt: new Date().toISOString(),
        comments: [
          {
            id: `c-init-${Date.now()}`,
            author: 'Gallery Curator',
            role: 'Curator',
            text: `Exhibition entry approved for ${selectedTierConfig.name}. Welcome to the PhoenixStudios gallery wall!`,
            createdAt: 'Just now'
          }
        ]
      };

      setTimeout(() => {
        onSubmit(finalArtwork);
        onClose();
        // Reset state
        setStep(1);
        setPaymentSuccess(false);
      }, 2400);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="submit-artwork-modal-container"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400">
              Curatorial Exhibition Program
            </span>
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-zinc-100">
              Exhibit Your Artwork
            </h2>
          </div>
          <button
            id="close-submit-modal-btn"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Navigation Bar */}
        <div className="px-6 py-3 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between overflow-x-auto gap-2">
          {[
            { num: 1, label: 'Artwork Details' },
            { num: 2, label: 'Frame & Styling' },
            { num: 3, label: 'Exhibition Tier' },
            { num: 4, label: 'Fee & Placement' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-2 whitespace-nowrap text-xs font-medium ${
                step === s.num
                  ? 'text-amber-400 font-semibold'
                  : step > s.num
                  ? 'text-zinc-300'
                  : 'text-zinc-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-amber-400 text-zinc-950'
                    : step > s.num
                    ? 'bg-zinc-700 text-zinc-200'
                    : 'bg-zinc-800 text-zinc-600'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span>{s.label}</span>
              {s.num < 4 && <span className="text-zinc-700 ml-1">/</span>}
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* STEP 1: Upload or Draw + Info */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Media Selection: Upload or In-App Drawing */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Artwork Image / Media Source *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Upload Box */}
                  <label className="group relative border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-zinc-950/40 hover:bg-zinc-900 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <Upload className="w-8 h-8 text-zinc-400 group-hover:text-amber-400 transition-colors mb-2" />
                    <span className="text-sm font-medium text-zinc-200">
                      Upload Art File
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">
                      PNG, JPG, WebP up to 25MB
                    </span>
                  </label>

                  {/* Draw on Canvas Option */}
                  <button
                    type="button"
                    onClick={onOpenDrawingStudio}
                    className="border-2 border-dashed border-zinc-700 hover:border-amber-400/70 rounded-xl p-5 flex flex-col items-center justify-center text-center bg-zinc-950/40 hover:bg-zinc-900 transition-all group"
                  >
                    <Paintbrush className="w-8 h-8 text-zinc-400 group-hover:text-amber-400 transition-colors mb-2" />
                    <span className="text-sm font-medium text-zinc-200">
                      Paint in Studio Canvas
                    </span>
                    <span className="text-xs text-zinc-500 mt-1">
                      Create original digital painting right now
                    </span>
                  </button>
                </div>

                {/* Selected Preview Thumbnail */}
                {imageUrl && (
                  <div className="mt-3 flex items-center gap-3 p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <img
                      src={imageUrl}
                      alt="Uploaded art preview"
                      className="w-14 h-14 object-cover rounded border border-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Artwork media loaded
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        High-resolution ready for gallery mounting
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs text-rose-400 hover:underline px-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Artwork Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Artwork Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Celestial Symphony"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Artist / Creator Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. Jean-Luc Moreau"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Medium *
                  </label>
                  <select
                    value={medium}
                    onChange={(e) => setMedium(e.target.value as ArtMedium)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  >
                    {MEDIUMS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Year of Creation
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Profile Category Selection */}
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    Profile Gallery Category
                  </label>
                  {!showAddCat && (
                    <button
                      type="button"
                      onClick={() => setShowAddCat(true)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> New Category
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(currentUser?.categories || ['Studio Highlights', 'Atmospheric Landscapes', 'Portrait Studies']).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-amber-400 text-zinc-950 font-bold shadow'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {showAddCat && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Category name (e.g. Plein Air)"
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="px-3 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCat(false)}
                      className="px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Artwork Description & Artist Statement
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the inspiration, technique, and emotional dialogue behind this piece..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Sale / Valuation Option & Fixed Fee Note */}
              <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-zinc-200">
                      List in PhoenixStudios Marketplace
                    </span>
                    <p className="text-xs text-zinc-400">
                      Allows collectors to acquire this piece through secure 256-bit escrow checkout
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isForSale}
                    onChange={(e) => setIsForSale(e.target.checked)}
                    className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
                  />
                </div>

                {isForSale && (
                  <div className="pt-2 border-t border-zinc-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-medium text-zinc-400">
                        Listing Price (USD):
                      </label>
                      <div className="relative w-40">
                        <span className="absolute left-3 top-2 text-sm text-zinc-400">$</span>
                        <input
                          type="number"
                          min="1"
                          value={salePrice}
                          onChange={(e) => setSalePrice(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                    <div className="p-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>Fixed Platform Fee (deducted upon sale): <strong>$15.00</strong></span>
                      <span className="text-emerald-400 font-mono font-bold">
                        Your Net Payout: ${Math.max(0, salePrice - 15).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Frame & Presentation Customization */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-serif-display text-lg font-bold text-zinc-100">
                  Select Museum Framing
                </h3>
                <p className="text-xs text-zinc-400">
                  Choose how your piece will be presented on the gallery exhibition wall.
                </p>

                <div className="space-y-3 mt-3">
                  {FRAMES.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setFrameStyle(f.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        frameStyle === f.id
                          ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 ${
                              frameStyle === f.id
                                ? 'border-amber-400 bg-amber-400'
                                : 'border-zinc-600'
                            }`}
                          />
                          <h4 className="text-sm font-semibold text-zinc-200">
                            {f.label}
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 pl-5.5">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview Display */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/80 border border-zinc-800 rounded-2xl">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                  Live Gallery Wall Preview
                </span>
                <div className="w-full max-w-[260px]">
                  <ArtFrame artwork={previewArtwork} priority showPlaque />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Exhibition Tier & Display Fee Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="font-serif-display text-2xl font-bold text-zinc-100">
                  Select Your Exhibition Display Tier
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Exhibition fees support museum archival maintenance, lighting, and placement in our curated galleries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {EXHIBITION_TIERS.map((tier) => {
                  const isSelected = displayTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setDisplayTier(tier.id)}
                      className={`relative rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? `bg-zinc-950 ${tier.borderClass} ring-2 ring-amber-400/40 shadow-xl scale-[1.02]`
                          : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {tier.id === 'spotlight' && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-sky-500 text-zinc-950 rounded-full shadow-md">
                          Most Popular
                        </span>
                      )}
                      {tier.id === 'grand_salon' && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-zinc-950 rounded-full shadow-md">
                          VIP Centerpiece
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            {tier.hallName}
                          </span>
                          <span
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: isSelected ? tier.accentColor : '#52525b' }}
                          >
                            {isSelected && (
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: tier.accentColor }}
                              />
                            )}
                          </span>
                        </div>

                        <h4 className="font-serif-display text-xl font-bold text-zinc-100 mt-1">
                          {tier.name}
                        </h4>

                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-3xl font-bold font-mono text-zinc-100">
                            ${tier.fee}
                          </span>
                          <span className="text-xs text-zinc-400">
                            / {tier.durationDays} days display
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                          {tier.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-zinc-800 space-y-2">
                          {tier.perks.map((p, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-[11px] text-zinc-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-zinc-800">
                        <button
                          type="button"
                          className={`w-full py-2 text-xs font-bold rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-amber-400 text-zinc-950'
                              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {isSelected ? 'Selected Tier' : 'Select Tier'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Checkout & Fee Payment */}
          {step === 4 && (
            <div className="max-w-xl mx-auto space-y-6">
              {paymentSuccess ? (
                <div className="py-8 text-center space-y-4 animate-scale-up">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-bold text-zinc-100">
                    Artwork Successfully Mounted!
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Your exhibition display fee of{' '}
                    <span className="text-amber-400 font-bold">
                      ${selectedTierConfig.fee}.00
                    </span>{' '}
                    has been processed. Your artwork is now officially on display in{' '}
                    <span className="text-white font-medium">
                      {selectedTierConfig.hallName}
                    </span>
                    .
                  </p>

                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl inline-block text-left text-xs font-mono text-zinc-300 space-y-1">
                    <div>
                      <span className="text-zinc-500">Exhibition Pass:</span>{' '}
                      <span className="text-amber-400 font-bold">{generatedPassId}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Tier:</span> {selectedTierConfig.name}
                    </div>
                    <div>
                      <span className="text-zinc-500">Duration:</span>{' '}
                      {selectedTierConfig.durationDays} Days Active Display
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 animate-pulse">
                    Placing onto gallery wall...
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <h4 className="font-serif-display text-base font-bold text-zinc-200">
                          {selectedTierConfig.name} Exhibition Listing
                        </h4>
                        <p className="text-xs text-zinc-400">
                          {selectedTierConfig.hallName} • {selectedTierConfig.durationDays}-Day Display
                        </p>
                      </div>
                      <span className="font-mono text-lg font-bold text-amber-400">
                        ${selectedTierConfig.fee}.00
                      </span>
                    </div>

                    <div className="pt-3 space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span>Curatorial Review & Installation</span>
                        <span className="text-zinc-200">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gallery Wall Preservation & Lighting</span>
                        <span className="text-zinc-200">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Visitor Guestbook & Inquiries</span>
                        <span className="text-zinc-200">Included</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-zinc-800/80 font-bold text-sm text-zinc-100">
                        <span>Total Display Fee Due:</span>
                        <span className="font-mono text-amber-400 font-bold">
                          ${selectedTierConfig.fee}.00
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Payment Method (Simulated Checkout)
                      </label>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 font-mono focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 font-mono focus:outline-hidden focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      By submitting, your artwork will immediately be mounted in{' '}
                      <strong>{selectedTierConfig.name}</strong> and visible to all visitors.
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!paymentSuccess && (
          <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !title.trim()) {
                    alert('Please provide an artwork title.');
                    return;
                  }
                  if (step === 1 && !artistName.trim()) {
                    alert('Please provide an artist name.');
                    return;
                  }
                  setStep((s) => (s + 1) as any);
                }}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handlePayAndExhibit}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    Processing Exhibition Fee...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4" />
                    Pay ${selectedTierConfig.fee}.00 & Mount on Display
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

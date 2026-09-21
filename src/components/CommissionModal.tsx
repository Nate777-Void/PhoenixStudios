import React, { useState } from 'react';
import { UserProfile, CommissionRequest, CommissionTier } from '../types';
import {
  X,
  Sparkles,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: UserProfile;
  currentUser: UserProfile;
  onRequestSubmitted: (request: CommissionRequest) => void;
}

export const CommissionModal: React.FC<CommissionModalProps> = ({
  isOpen,
  onClose,
  artist,
  currentUser,
  onRequestSubmitted
}) => {
  const [selectedTier, setSelectedTier] = useState<CommissionTier | null>(
    artist.commissionSettings.serviceTiers[0] || null
  );
  const [specifications, setSpecifications] = useState('');
  const [budget, setBudget] = useState<number>(
    selectedTier ? selectedTier.price : artist.commissionSettings.baseRate
  );
  const [deadline, setDeadline] = useState('');
  const [buyerName, setBuyerName] = useState(currentUser.displayName);
  const [buyerEmail, setBuyerEmail] = useState('collector@phoenixstudios.art');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTierSelect = (tier: CommissionTier) => {
    setSelectedTier(tier);
    setBudget(tier.price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!specifications.trim()) {
      alert('Please describe your artwork specifications.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRequest: CommissionRequest = {
        id: `comm-${Date.now()}`,
        artistId: artist.id,
        artistName: artist.displayName,
        buyerId: currentUser.id,
        buyerName: buyerName.trim() || 'Collector',
        buyerEmail: buyerEmail.trim(),
        tierId: selectedTier ? selectedTier.id : 'custom',
        tierName: selectedTier ? selectedTier.name : 'Bespoke Commission',
        specifications: specifications.trim(),
        budget: Number(budget),
        deadline: deadline || 'Flexible (per artist turnaround)',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      onRequestSubmitted(newRequest);
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 2200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="commission-request-modal"
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={artist.avatarUrl}
              alt={artist.displayName}
              className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                Custom Artwork Commission
              </span>
              <h2 className="font-serif-display text-lg sm:text-xl font-bold text-zinc-100">
                Commission {artist.displayName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submittedSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-zinc-100">
                Commission Request Dispatched!
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Your commission proposal has been sent directly to {artist.displayName}. The artist will review your specifications and respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Artist availability status badge */}
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      artist.commissionSettings.availabilityStatus === 'Open'
                        ? 'bg-emerald-400 animate-pulse'
                        : artist.commissionSettings.availabilityStatus === 'Limited Slots'
                        ? 'bg-amber-400'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <span className="font-semibold text-zinc-200">
                    Status: {artist.commissionSettings.availabilityStatus}
                  </span>
                  <span className="text-zinc-500">• Turnaround: {artist.commissionSettings.turnaroundTime}</span>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  Base rate from ${artist.commissionSettings.baseRate}
                </span>
              </div>

              {/* Commission Service Tiers */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Select Commission Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {artist.commissionSettings.serviceTiers.map((tier) => {
                    const isSelected = selectedTier?.id === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => handleTierSelect(tier)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-zinc-200">
                            {tier.name}
                          </h4>
                          <span className="font-mono text-xs font-bold text-amber-400">
                            ${tier.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                          {tier.description}
                        </p>
                        <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          <span>Estimated: {tier.turnaround}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specifications & Brief */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Commission Specifications & Creative Brief *
                </label>
                <textarea
                  rows={4}
                  required
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  placeholder="Detail the subject matter, color mood, visual elements, dimensions, references, or specific atmosphere you envision..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              {/* Budget & Target Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Proposed Budget ($USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min={artist.commissionSettings.baseRate}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-100 font-mono focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Base starting rate is ${artist.commissionSettings.baseRate}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Target Completion Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Suggested turnaround: {artist.commissionSettings.turnaroundTime}
                  </span>
                </div>
              </div>

              {/* Buyer Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Name / Collector Alias
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs sm:text-sm text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Artist Guidelines Callout */}
              {artist.commissionSettings.guidelines && (
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1">
                  <span className="font-semibold text-zinc-300 block">
                    Artist Commission Terms & Guidelines:
                  </span>
                  <p className="italic text-[11px]">
                    "{artist.commissionSettings.guidelines}"
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Phoenix Studios Escrow & Client Protection</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        Dispatching Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Commission Request (${budget})
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

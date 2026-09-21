import React, { useState } from 'react';
import { Artwork, MarketplaceOrder, UserProfile } from '../types';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  DollarSign,
  Truck,
  Sparkles,
  Receipt,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarketplaceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: Artwork;
  currentUser: UserProfile;
  onOrderCompleted: (order: MarketplaceOrder) => void;
}

export const FIXED_PLATFORM_FEE = 15.0; // Fixed fee per successful sale deducted from artist payout

export const MarketplaceCheckoutModal: React.FC<MarketplaceCheckoutModalProps> = ({
  isOpen,
  onClose,
  artwork,
  currentUser,
  onOrderCompleted
}) => {
  const [buyerName, setBuyerName] = useState(currentUser.displayName);
  const [buyerEmail, setBuyerEmail] = useState('collector@phoenixstudios.art');
  const [shippingAddress, setShippingAddress] = useState('450 Mission St, Suite 800, San Francisco, CA');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 8831');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvc, setCardCvc] = useState('742');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);

  if (!isOpen) return null;

  const salePrice = artwork.salePrice || 0;
  const platformFee = FIXED_PLATFORM_FEE;
  const artistEarnings = Math.max(0, salePrice - platformFee);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `PHX-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const order: MarketplaceOrder = {
        id: orderId,
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        artworkImageUrl: artwork.imageUrl,
        artistId: artwork.artistId,
        artistName: artwork.artistName,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        salePrice,
        platformFee,
        artistEarnings,
        status: 'completed',
        orderedAt: new Date().toISOString(),
        shippingAddress: shippingAddress.trim()
      };

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      setIsProcessing(false);
      setCompletedOrder(order);
      onOrderCompleted(order);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="marketplace-checkout-dialog"
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                PhoenixStudios Secure Marketplace
              </span>
              <h2 className="font-serif-display text-lg sm:text-xl font-bold text-zinc-100">
                Acquire Original Artwork
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {completedOrder ? (
            <div className="py-8 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-zinc-100">
                Transaction Completed!
              </h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Congratulations! You are now the official owner and collector of{' '}
                <span className="text-amber-400 font-bold">"{artwork.title}"</span>. The fixed platform fee of $15.00 has been processed, and the net payout of ${artistEarnings.toLocaleString()} has been safely credited to {artwork.artistName}'s studio account.
              </p>

              {/* Receipt Summary */}
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl max-w-md mx-auto text-left text-xs font-mono space-y-2">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Order Reference:</span>
                  <span className="text-amber-400 font-bold">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Artwork Title:</span>
                  <span className="text-zinc-200">{artwork.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Artist:</span>
                  <span className="text-zinc-200">{artwork.artistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Purchase:</span>
                  <span className="text-zinc-100 font-bold">${salePrice.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between pt-1 text-[11px] text-zinc-500">
                  <span>Fixed Platform Fee Deducted:</span>
                  <span>-${platformFee.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-400 font-semibold border-t border-zinc-800 pt-1">
                  <span>Artist Net Earnings:</span>
                  <span>${artistEarnings.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
                >
                  Return to Gallery & Marketplace
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePurchase} className="space-y-5">
              {/* Artwork Preview Card */}
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center gap-4">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif-display text-base font-bold text-zinc-100 truncate">
                    {artwork.title}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    by {artwork.artistName} • {artwork.medium}
                  </p>
                  <p className="text-xs font-mono text-amber-400 font-bold mt-1">
                    ${salePrice.toLocaleString()} USD
                  </p>
                </div>
              </div>

              {/* Transparent Fixed Platform Fee Breakdown */}
              <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-2 text-xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block pb-1 border-b border-zinc-800">
                  Price & Fixed Platform Fee Breakdown
                </span>
                <div className="flex justify-between text-zinc-300">
                  <span>Listing Price (Buyer Total)</span>
                  <span className="font-mono font-semibold">${salePrice.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="flex items-center gap-1">
                    Fixed Phoenix Platform Fee (Deducted from Artist)
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 rounded">Fixed Rate</span>
                  </span>
                  <span className="font-mono text-amber-400">-${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold pt-2 border-t border-zinc-800">
                  <span>Artist Net Earnings Deposited</span>
                  <span className="font-mono">${artistEarnings.toLocaleString()}.00</span>
                </div>
                <p className="text-[10px] text-zinc-500 pt-1 leading-normal">
                  PhoenixStudios deducts a predictable fixed fee of $15.00 per successful sale to support curatorial hosting and escrow guarantees. The artist receives the remaining balance directly in their wallet.
                </p>
              </div>

              {/* Delivery / Shipping Info */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                  Delivery & Collector Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-300 mb-1">
                      Collector Name
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-300 mb-1">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-300 mb-1">
                    Delivery Address / Archival Shipping Destination
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Payment Method
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Escrow Vault
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Expires
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Submit & Secure Pay */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      Securing Transaction...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Authorize Payment of ${salePrice.toLocaleString()}.00
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

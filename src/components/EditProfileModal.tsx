import React, { useState } from 'react';
import { UserProfile, CommissionTier } from '../types';
import { X, Plus, Trash2, Check, ShieldCheck, DollarSign } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(profile.bannerUrl || '');
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location || '');
  const [categories, setCategories] = useState<string[]>(profile.categories);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Commission Settings
  const [acceptingCommissions, setAcceptingCommissions] = useState(
    profile.commissionSettings.acceptingCommissions
  );
  const [availabilityStatus, setAvailabilityStatus] = useState(
    profile.commissionSettings.availabilityStatus
  );
  const [baseRate, setBaseRate] = useState(profile.commissionSettings.baseRate);
  const [turnaroundTime, setTurnaroundTime] = useState(profile.commissionSettings.turnaroundTime);
  const [guidelines, setGuidelines] = useState(profile.commissionSettings.guidelines);
  const [serviceTiers, setServiceTiers] = useState<CommissionTier[]>(
    profile.commissionSettings.serviceTiers
  );

  // New tier state
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState<number>(300);
  const [newTierDesc, setNewTierDesc] = useState('');
  const [newTierTurnaround, setNewTierTurnaround] = useState('2 weeks');

  if (!isOpen) return null;

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    if (categories.includes(newCategoryInput.trim())) return;
    setCategories([...categories, newCategoryInput.trim()]);
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const handleAddTier = () => {
    if (!newTierName.trim()) return;
    const newTier: CommissionTier = {
      id: `tier-${Date.now()}`,
      name: newTierName.trim(),
      price: Number(newTierPrice),
      description: newTierDesc.trim() || 'Custom bespoke artwork tier.',
      turnaround: newTierTurnaround.trim() || '2 weeks'
    };
    setServiceTiers([...serviceTiers, newTier]);
    setNewTierName('');
    setNewTierDesc('');
  };

  const handleRemoveTier = (tierId: string) => {
    setServiceTiers(serviceTiers.filter((t) => t.id !== tierId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || profile.username,
      avatarUrl: avatarUrl.trim() || profile.avatarUrl,
      bannerUrl: bannerUrl.trim() || profile.bannerUrl,
      bio: bio.trim(),
      location: location.trim(),
      categories: categories.length > 0 ? categories : ['General Portfolio'],
      commissionSettings: {
        acceptingCommissions,
        availabilityStatus,
        baseRate: Number(baseRate),
        turnaroundTime: turnaroundTime.trim(),
        guidelines: guidelines.trim(),
        serviceTiers
      }
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="edit-profile-modal"
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="font-serif-display text-xl font-bold text-zinc-100">
            Edit Artist Profile & Commission Rates
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Identity Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Profile Identity & Bio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Username (@handle)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-zinc-500">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Location / Studio
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Artist Bio & Statement
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
              />
            </div>
          </div>

          {/* Profile Gallery Categories */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Gallery Categories & Collections
            </h3>
            <p className="text-xs text-zinc-400">
              Categorize and organize your artwork pieces on your profile gallery.
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-800 text-zinc-200 rounded-full text-xs font-medium"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="text-zinc-400 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="New category name (e.g. Plein-Air Studies)"
                className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>
          </div>

          {/* Commission Rates & Availability */}
          <div className="space-y-4 pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Custom Artwork Commission Rates & Availability
                </h3>
                <p className="text-xs text-zinc-400">
                  Allow buyers to commission bespoke paintings and artwork directly from you.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptingCommissions}
                  onChange={(e) => setAcceptingCommissions(e.target.checked)}
                  className="w-4 h-4 accent-amber-400 rounded"
                />
                <span className="text-xs font-semibold text-zinc-200">
                  Accept Commissions
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Availability Status
                </label>
                <select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                >
                  <option value="Open">Open for Requests</option>
                  <option value="Limited Slots">Limited Slots (Few Left)</option>
                  <option value="Waitlist">Waitlist Only</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Base Starting Rate ($USD)
                </label>
                <input
                  type="number"
                  value={baseRate}
                  onChange={(e) => setBaseRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Estimated Turnaround
                </label>
                <input
                  type="text"
                  value={turnaroundTime}
                  onChange={(e) => setTurnaroundTime(e.target.value)}
                  placeholder="e.g. 2-3 weeks"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Commission Terms & Guidelines
              </label>
              <textarea
                rows={2}
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                placeholder="Specific subjects you love painting, physical shipping terms, revision policies..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Service Tiers List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-zinc-300 block">
                Commission Service Tiers & Packages ({serviceTiers.length})
              </span>
              <div className="space-y-2">
                {serviceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-200">{tier.name}</span>
                        <span className="font-mono text-amber-400 font-bold">
                          ${tier.price}
                        </span>
                        <span className="text-zinc-500 font-mono">• {tier.turnaround}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{tier.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(tier.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Remove tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Tier Sub-form */}
              <div className="p-3 bg-zinc-950/60 border border-dashed border-zinc-800 rounded-xl space-y-2">
                <span className="text-[11px] font-semibold text-zinc-400 block">
                  Add New Commission Tier:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newTierName}
                    onChange={(e) => setNewTierName(e.target.value)}
                    placeholder="Tier Name (e.g. Master Oil Canvas)"
                    className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                  <input
                    type="number"
                    value={newTierPrice}
                    onChange={(e) => setNewTierPrice(Number(e.target.value))}
                    placeholder="Price ($USD)"
                    className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={newTierTurnaround}
                    onChange={(e) => setNewTierTurnaround(e.target.value)}
                    placeholder="Turnaround (e.g. 3 weeks)"
                    className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTierDesc}
                    onChange={(e) => setNewTierDesc(e.target.value)}
                    placeholder="Tier specifications, size, framing inclusion..."
                    className="flex-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-100 focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTier}
                    className="px-3 py-1.5 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
                  >
                    + Add Tier
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

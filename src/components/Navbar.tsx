import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Plus,
  Frame,
  User,
  ShoppingBag,
  Users,
  Flame,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

export type MainNavTab = 'gallery' | 'marketplace' | 'artists' | 'my-profile';

interface NavbarProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  currentUser: UserProfile;
  allProfiles: UserProfile[];
  onSwitchProfile: (profileId: string) => void;
  onOpenSubmit: () => void;
  onOpenDrawingStudio: () => void;
  totalArtCount: number;
  marketplaceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  allProfiles,
  onSwitchProfile,
  onOpenSubmit,
  onOpenDrawingStudio,
  totalArtCount,
  marketplaceCount
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-850 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo / Brand */}
          <div
            onClick={() => onSelectTab('gallery')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 group-hover:text-amber-300 transition-colors">
                  PhoenixStudios
                </span>
                <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded">
                  Art Platform
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 tracking-wide hidden sm:block">
                Curated Galleries • Marketplace • Custom Commissions
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => onSelectTab('gallery')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentTab === 'gallery'
                  ? 'bg-zinc-800 text-amber-400 border border-amber-400/20 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Frame className="w-3.5 h-3.5" />
              <span>Gallery Halls</span>
              <span className="text-[10px] font-mono text-zinc-500">({totalArtCount})</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('marketplace')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentTab === 'marketplace'
                  ? 'bg-zinc-800 text-amber-400 border border-amber-400/20 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Marketplace</span>
              <span className="px-1.5 py-0.2 bg-amber-400/15 text-amber-400 text-[9px] font-bold rounded">
                Fixed $15 Fee
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('artists')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentTab === 'artists'
                  ? 'bg-zinc-800 text-amber-400 border border-amber-400/20 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Resident Artists</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('my-profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                currentTab === 'my-profile'
                  ? 'bg-zinc-800 text-amber-400 border border-amber-400/20 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Studio Profile</span>
            </button>
          </nav>

          {/* Action Controls & Active Profile Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Paint button */}
            <button
              id="nav-drawing-canvas-btn"
              type="button"
              onClick={onOpenDrawingStudio}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors flex items-center gap-1.5"
              title="Open virtual canvas to draw or paint"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Paint Studio</span>
            </button>

            {/* Exhibit Artwork CTA */}
            <button
              id="nav-submit-artwork-btn"
              type="button"
              onClick={onOpenSubmit}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Exhibit Art</span>
            </button>

            {/* Profile Avatar Pill & Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-colors"
                title="Active Profile & Switcher"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-7 h-7 rounded-lg object-cover border border-amber-400/40"
                />
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <span className="font-bold text-zinc-200 block truncate max-w-[90px]">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    @{currentUser.username}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in">
                  <div className="p-2 border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
                      Active User Profile
                    </span>
                    <p className="font-bold text-zinc-100 text-sm mt-0.5">
                      {currentUser.displayName}
                    </p>
                    <p className="text-amber-400 font-mono text-xs">@{currentUser.username}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Wallet: <strong className="text-emerald-400">${currentUser.walletBalance.toLocaleString()}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('my-profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>View My Studio Profile</span>
                  </button>

                  <div className="pt-2 border-t border-zinc-800">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block px-2 mb-1">
                      Switch Active Artist:
                    </span>
                    {allProfiles.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSwitchProfile(p.id);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                          p.id === currentUser.id
                            ? 'bg-amber-400/10 text-amber-400 font-semibold'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={p.avatarUrl}
                            alt={p.displayName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate">{p.displayName}</span>
                        </div>
                        {p.id === currentUser.id && (
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-zinc-900 text-xs">
          <button
            type="button"
            onClick={() => onSelectTab('gallery')}
            className={`px-3 py-1 font-semibold rounded-lg ${
              currentTab === 'gallery' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            Gallery
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('marketplace')}
            className={`px-3 py-1 font-semibold rounded-lg ${
              currentTab === 'marketplace' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            Marketplace
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('artists')}
            className={`px-3 py-1 font-semibold rounded-lg ${
              currentTab === 'artists' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            Artists
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('my-profile')}
            className={`px-3 py-1 font-semibold rounded-lg ${
              currentTab === 'my-profile' ? 'text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            My Profile
          </button>
        </div>
      </div>
    </header>
  );
};

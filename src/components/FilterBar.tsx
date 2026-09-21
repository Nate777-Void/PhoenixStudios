import React from 'react';
import { GalleryFilter } from '../types';
import { Search, SlidersHorizontal, Sparkles, Filter, Grid3X3, LayoutGrid } from 'lucide-react';

interface FilterBarProps {
  filters: GalleryFilter;
  onChange: (filters: GalleryFilter) => void;
  viewMode: 'gallery-wall' | 'compact-grid';
  onViewModeChange: (mode: 'gallery-wall' | 'compact-grid') => void;
  totalFilteredCount: number;
}

const MEDIUM_LIST = [
  'All Mediums',
  'Oil on Canvas',
  'Acrylic on Linen',
  'Digital Painting',
  'Mixed Media',
  'Watercolor & Ink',
  'Photography'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount
}) => {
  return (
    <div className="bg-zinc-950/70 border-b border-zinc-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top row: Search, Sort, View mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-gallery-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Search by artwork title, artist, or style..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-400/80 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <select
                id="sort-gallery-select"
                value={filters.sortBy}
                onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
                className="bg-transparent border-none text-zinc-200 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="featured" className="bg-zinc-900">
                  Featured (Tier Priority)
                </option>
                <option value="newest" className="bg-zinc-900">
                  Newly Mounted
                </option>
                <option value="likes" className="bg-zinc-900">
                  Most Admired (Likes)
                </option>
                <option value="price_high" className="bg-zinc-900">
                  Price: High to Low
                </option>
                <option value="price_low" className="bg-zinc-900">
                  Price: Low to High
                </option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-900 p-1 border border-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => onViewModeChange('gallery-wall')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'gallery-wall'
                    ? 'bg-zinc-800 text-amber-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Museum Gallery Wall View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('compact-grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'compact-grid'
                    ? 'bg-zinc-800 text-amber-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Compact Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: Medium filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-zinc-500 shrink-0 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Medium:
          </span>
          {MEDIUM_LIST.map((m) => {
            const isSelected =
              m === 'All Mediums' ? !filters.medium : filters.medium === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    medium: m === 'All Mediums' ? '' : m
                  })
                }
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

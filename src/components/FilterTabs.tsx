'use client';

import { ChevronDown, Filter, SortAsc, Grid, List } from 'lucide-react';
import { AssetType, ConfidentialityLevel, ApprovalStatus, AssetTab, ViewMode } from '../lib/types';

interface FilterTabsProps {
  selectedType: AssetType | 'all';
  onTypeChange: (type: AssetType | 'all') => void;
  selectedConfidentiality: ConfidentialityLevel | 'all';
  onConfidentialityChange: (level: ConfidentialityLevel | 'all') => void;
  selectedStatus: ApprovalStatus | 'all';
  onStatusChange: (status: ApprovalStatus | 'all') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalAssets: number;
  filteredCount: number;
  activeTab: AssetTab;
  onTabChange: (tab: AssetTab) => void;
  assetCount: number;
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function FilterTabs({
  selectedType,
  onTypeChange,
  selectedConfidentiality,
  onConfidentialityChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  totalAssets,
  filteredCount,
  activeTab,
  onTabChange,
  assetCount,
  totalCount,
  viewMode,
  onViewModeChange
}: FilterTabsProps) {
  const tabs: { key: AssetTab; label: string }[] = [
    { key: 'all', label: 'All Assets' },
    { key: 'projects', label: 'Projects' },
    { key: 'collections', label: 'Collections' },
    { key: 'archived', label: 'Archived' },
    { key: 'final', label: 'Final Assets' },
    { key: 'working', label: 'Working Assets' },
  ];

  return (
    <div className="bg-background">
      <div className="px-8 py-6">
        {/* Asset Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-6 py-3 rounded-lg transition-colors font-medium text-sm ${
                  activeTab === tab.key 
                    ? 'bg-accent text-white' 
                    : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground font-medium">
            {assetCount} of {totalCount} assets
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value as AssetType | 'all')}
                className="text-sm border rounded-md px-3 py-2 bg-background hover:bg-muted transition-colors min-w-[120px]"
              >
                <option value="all">Asset type</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="pdf">PDFs</option>
                <option value="psd">PSDs</option>
                <option value="document">Documents</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedConfidentiality}
                onChange={(e) => onConfidentialityChange(e.target.value as ConfidentialityLevel | 'all')}
                className="text-sm border rounded-md px-3 py-2 bg-background hover:bg-muted transition-colors min-w-[120px]"
              >
                <option value="all">Confidentiality</option>
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="confidential">Confidential</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value as ApprovalStatus | 'all')}
                className="text-sm border rounded-md px-3 py-2 bg-background hover:bg-muted transition-colors min-w-[120px]"
              >
                <option value="all">Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button className="text-sm border rounded-md px-3 py-2 bg-background hover:bg-muted transition-colors flex items-center gap-1 min-w-[80px]">
                <span>Tags</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            <span className="text-sm text-muted-foreground">
              {filteredCount} of {totalAssets} Results
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Order by</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-sm border rounded-md px-3 py-2 bg-background hover:bg-muted transition-colors min-w-[120px]"
              >
                <option value="date-added">Date added</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="size">Size</option>
              </select>
              <SortAsc className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex gap-1 border rounded-md">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-accent text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-accent text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

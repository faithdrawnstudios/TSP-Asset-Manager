"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Grid3x3, 
  List, 
  Plus, 
  Bell, 
  User, 
  Settings,
  ChevronDown,
  ExternalLink,
  Package
} from "lucide-react";
import AssetList from "@/components/AssetList";
import ThemeToggle from "@/components/ThemeToggle";
import AssetEditor from "@/components/AssetEditor";
import KitCreator from "@/components/KitCreator";
import { mockAssets, categories, confidentialityLevels, sortOptions } from "@/lib/mockData";
import { Asset, FilterState, SortOption, ViewMode, SelectedAssets } from "@/lib/types";

export default function DAMDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeTab, setActiveTab] = useState("assets");
  const [selectedAssets, setSelectedAssets] = useState<SelectedAssets>({});
  const [showAssetEditor, setShowAssetEditor] = useState(false);
  const [showKitCreator, setShowKitCreator] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  
  const [filters, setFilters] = useState<FilterState>({
    category: "All Types",
    confidentiality: "All",
    dateRange: "All",
    fileType: "All",
    search: ""
  });
  
  const [sortOption, setSortOption] = useState<SortOption>(sortOptions[0]);

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                           asset.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
                           asset.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = filters.category === "All Types" || asset.category === filters.category;
      const matchesConfidentiality = filters.confidentiality === "All" || asset.confidentiality === filters.confidentiality;
      
      return matchesSearch && matchesCategory && matchesConfidentiality;
    });

    // Sort assets
    filtered.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOption.direction === "asc" ? comparison : -comparison;
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return sortOption.direction === "asc" ? comparison : -comparison;
      }
      
      return 0;
    });

    return filtered;
  }, [assets, filters, sortOption]);

  const handleAssetSelect = (assetId: string, selected: boolean) => {
    setSelectedAssets(prev => ({
      ...prev,
      [assetId]: selected
    }));
  };

  const handleSelectAll = () => {
    const allSelected = filteredAndSortedAssets.every(asset => selectedAssets[asset.id]);
    const newSelected: SelectedAssets = {};
    
    if (!allSelected) {
      filteredAndSortedAssets.forEach(asset => {
        newSelected[asset.id] = true;
      });
    }
    
    setSelectedAssets(newSelected);
  };

  // Enhanced download handler for Dropbox URLs
  const handleAssetDownload = (asset: Asset) => {
    // Convert Dropbox share URL to direct download URL
    const downloadUrl = asset.link.includes('dropbox.com') 
      ? asset.link.replace('?dl=0', '?dl=1').replace('dropbox.com', 'dl.dropboxusercontent.com')
      : asset.link;
    
    console.log("Downloading asset:", asset.name);
    window.open(downloadUrl, "_blank");
  };

  // Download multiple selected assets
  const handleBulkDownload = () => {
    const selectedAssetsList = filteredAndSortedAssets.filter(asset => selectedAssets[asset.id]);
    
    if (selectedAssetsList.length === 0) return;
    
    if (selectedAssetsList.length === 1) {
      handleAssetDownload(selectedAssetsList[0]);
      return;
    }

    // For multiple files, download sequentially with small delays
    selectedAssetsList.forEach((asset, index) => {
      setTimeout(() => {
        handleAssetDownload(asset);
      }, index * 500); // 500ms delay between downloads
    });
  };

  const handleAssetPreview = (asset: Asset) => {
    console.log("Preview asset:", asset);
    // TODO: Implement preview modal
  };

  const handleAssetShare = (asset: Asset) => {
    navigator.clipboard.writeText(asset.link);
    console.log("Share asset:", asset);
  };

  const handleAssetEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAssetEditor(true);
  };

  const handleAssetSave = (updatedAsset: Asset) => {
    if (editingAsset) {
      // Update existing asset
      setAssets(prev => prev.map(asset => 
        asset.id === updatedAsset.id ? updatedAsset : asset
      ));
    } else {
      // Add new asset
      setAssets(prev => [updatedAsset, ...prev]);
    }
    setShowAssetEditor(false);
    setEditingAsset(null);
  };

  const handleCreateKit = () => {
    const selectedAssetsList = filteredAndSortedAssets.filter(asset => selectedAssets[asset.id]);
    if (selectedAssetsList.length === 0) return;
    
    setShowKitCreator(true);
  };

  const handleKitCreated = (kitName: string, kitAssets: Asset[]) => {
    // Add kit tag to selected assets
    const kitTag = `kit:${kitName.toLowerCase().replace(/\s+/g, '-')}`;
    
    setAssets(prev => prev.map(asset => {
      if (kitAssets.some(ka => ka.id === asset.id)) {
        return {
          ...asset,
          tags: [...(asset.tags || []), kitTag]
        };
      }
      return asset;
    }));
    
    // Clear selection
    setSelectedAssets({});
    setShowKitCreator(false);
    
    console.log(`Kit "${kitName}" created with ${kitAssets.length} assets`);
  };

  const openPublicPortal = () => {
    window.open("/public-portal", "_blank", "width=1200,height=800");
  };

  const selectedCount = Object.values(selectedAssets).filter(Boolean).length;

  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FABRICATE</h1>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
                
                {/* Actions */}
                <ThemeToggle />
                
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <Bell size={20} />
                </button>
                
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <Settings size={20} />
                </button>
                
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <User size={20} />
                </button>
                
                <button 
                  onClick={() => {
                    setEditingAsset(null);
                    setShowAssetEditor(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Asset</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("assets")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "assets"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Digital Assets
              </button>
              <button
                onClick={() => setActiveTab("collections")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "collections"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Collections
              </button>
              <button
                onClick={openPublicPortal}
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium text-sm transition-colors flex items-center space-x-1"
              >
                <span>Public Portal</span>
                <ExternalLink size={14} />
              </button>
            </nav>
          </div>
        </div>

        {/* Filters Bar */}
        {activeTab === "assets" && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Confidentiality Filter */}
                <div className="relative">
                  <select
                    value={filters.confidentiality}
                    onChange={(e) => setFilters(prev => ({ ...prev, confidentiality: e.target.value }))}
                    className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    {confidentialityLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortOptions.findIndex(opt => opt.field === sortOption.field && opt.direction === sortOption.direction)}
                    onChange={(e) => setSortOption(sortOptions[parseInt(e.target.value)])}
                    className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  >
                    {sortOptions.map((option, index) => (
                      <option key={index} value={index}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Create Kit Button */}
                {selectedCount > 0 && (
                  <button 
                    onClick={handleCreateKit}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center space-x-1"
                  >
                    <Package size={14} />
                    <span>Create Kit</span>
                  </button>
                )}

                {/* Results and Selection Info */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredAndSortedAssets.length} results
                  {selectedCount > 0 && ` • ${selectedCount} selected`}
                </div>

                {/* Bulk Actions */}
                {selectedCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleBulkDownload}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Download Selected ({selectedCount})
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                      Share Selected
                    </button>
                  </div>
                )}

                {/* Select All */}
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {filteredAndSortedAssets.every(asset => selectedAssets[asset.id]) ? 'Deselect All' : 'Select All'}
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <Grid3x3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          {activeTab === "assets" && (
            <AssetList
              assets={filteredAndSortedAssets}
              viewMode={viewMode}
              selectedAssets={selectedAssets}
              onAssetSelect={handleAssetSelect}
              onAssetDownload={handleAssetDownload}
              onAssetPreview={handleAssetPreview}
              onAssetShare={handleAssetShare}
              onAssetEdit={handleAssetEdit}
            />
          )}
          
          {activeTab === "collections" && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Collections</h3>
              <p className="text-gray-500 dark:text-gray-400">Create and manage asset collections</p>
            </div>
          )}
        </main>
      </div>

      {/* Asset Editor Modal */}
      {showAssetEditor && (
        <AssetEditor
          asset={editingAsset}
          onSave={handleAssetSave}
          onClose={() => {
            setShowAssetEditor(false);
            setEditingAsset(null);
          }}
        />
      )}

      {/* Kit Creator Modal */}
      {showKitCreator && (
        <KitCreator
          selectedAssets={filteredAndSortedAssets.filter(asset => selectedAssets[asset.id])}
          onCreateKit={handleKitCreated}
          onClose={() => setShowKitCreator(false)}
        />
      )}
    </div>
  );
}
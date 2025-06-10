'use client';

import { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { FilterTabs } from '../components/FilterTabs';
import { AssetList } from '../components/AssetList';
import { AssetForm } from '../components/AssetForm';
import { Asset, ViewMode, AssetType, ConfidentialityLevel, ApprovalStatus, AssetTab } from '../lib/types';

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Company Logo',
    dropboxUrl: 'https://dropbox.com/s/example1',
    type: 'image',
    dateAdded: '2024-01-15T10:00:00Z',
    dateModified: '2024-01-15T10:00:00Z',
    confidentiality: 'public',
    tags: ['logo', 'brand', 'identity'],
    approvalStatus: 'approved',
    project: 'Brand Guidelines',
    versions: [],
  },
  {
    id: '2',
    name: 'Product Demo Video',
    dropboxUrl: 'https://dropbox.com/s/example2',
    type: 'video',
    dateAdded: '2024-01-20T14:30:00Z',
    dateModified: '2024-01-20T14:30:00Z',
    confidentiality: 'internal',
    tags: ['product', 'demo', 'marketing'],
    approvalStatus: 'pending',
    collection: 'Marketing Assets',
    versions: [],
  },
  {
    id: '3',
    name: 'User Manual PDF',
    dropboxUrl: 'https://dropbox.com/s/example3',
    type: 'pdf',
    dateAdded: '2024-01-22T09:15:00Z',
    dateModified: '2024-01-22T09:15:00Z',
    confidentiality: 'public',
    tags: ['documentation', 'manual', 'user-guide'],
    approvalStatus: 'approved',
    project: 'Documentation',
    versions: [],
  },
  {
    id: '4',
    name: 'Marketing Banner Design',
    dropboxUrl: 'https://dropbox.com/s/example4',
    type: 'psd',
    dateAdded: '2024-01-25T16:45:00Z',
    dateModified: '2024-01-25T16:45:00Z',
    confidentiality: 'internal',
    tags: ['banner', 'marketing', 'design'],
    approvalStatus: 'pending',
    collection: 'Marketing Assets',
    versions: [],
  },
  {
    id: '5',
    name: 'Financial Report Q4',
    dropboxUrl: 'https://dropbox.com/s/example5',
    type: 'document',
    dateAdded: '2024-01-28T11:30:00Z',
    dateModified: '2024-01-28T11:30:00Z',
    confidentiality: 'confidential',
    tags: ['finance', 'report', 'quarterly'],
    approvalStatus: 'approved',
    project: 'Financial Reports',
    versions: [],
  },
];

export default function HomePage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
  const [selectedConfidentiality, setSelectedConfidentiality] = useState<ConfidentialityLevel | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<AssetTab>('all');
  const [sortBy, setSortBy] = useState('date-added');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || asset.type === selectedType;
      const matchesConfidentiality = selectedConfidentiality === 'all' || asset.confidentiality === selectedConfidentiality;
      const matchesStatus = selectedStatus === 'all' || asset.approvalStatus === selectedStatus;

      return matchesSearch && matchesType && matchesConfidentiality && matchesStatus;
    });
  }, [assets, searchTerm, selectedType, selectedConfidentiality, selectedStatus]);

  const handleSaveAsset = (assetData: Partial<Asset>) => {
    if (editingAsset) {
      setAssets(prev => prev.map(asset => 
        asset.id === editingAsset.id ? { ...asset, ...assetData } : asset
      ));
    } else {
      setAssets(prev => [...prev, assetData as Asset]);
    }
    setEditingAsset(undefined);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingAsset(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onAddAsset={handleAddNew}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main>
        <FilterTabs
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedConfidentiality={selectedConfidentiality}
          onConfidentialityChange={setSelectedConfidentiality}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalAssets={assets.length}
          filteredCount={filteredAssets.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          assetCount={filteredAssets.length}
          totalCount={assets.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <AssetList
          assets={filteredAssets}
          viewMode={viewMode}
          onEditAsset={handleEditAsset}
        />
      </main>

      <AssetForm
        asset={editingAsset}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAsset}
      />
    </div>
  );
}

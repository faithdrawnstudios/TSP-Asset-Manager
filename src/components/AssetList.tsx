'use client';

import { Asset, ViewMode } from '../lib/types';
import { AssetCard } from './AssetCard';

interface AssetListProps {
  assets: Asset[];
  viewMode: ViewMode;
  onEditAsset: (asset: Asset) => void;
}

export function AssetList({ assets, viewMode, onEditAsset }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-8xl mb-6 opacity-50">📁</div>
        <h3 className="text-xl font-medium mb-3">No assets found</h3>
        <p className="text-muted-foreground text-lg">Add your first asset to get started</p>
      </div>
    );
  }

  return (
    <div className="px-8 pb-8">
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
          : 'space-y-3'
      }>
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            viewMode={viewMode}
            onEdit={onEditAsset}
          />
        ))}
      </div>
    </div>
  );
}

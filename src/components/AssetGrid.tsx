'use client';

import { Asset } from '../lib/types';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  onEditAsset: (asset: Asset) => void;
}

export function AssetGrid({ assets, onEditAsset }: AssetGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          viewMode="grid"
          onEdit={onEditAsset}
        />
      ))}
    </div>
  );
}

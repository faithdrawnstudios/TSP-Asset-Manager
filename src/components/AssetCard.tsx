'use client';

import { Download, Share, Eye, Edit, FileImage, FileVideo, FileText, File } from 'lucide-react';
import { Asset } from '../lib/types';
import classNames from 'classnames';

interface AssetCardProps {
  asset: Asset;
  viewMode: 'grid' | 'list';
  onEdit: (asset: Asset) => void;
}

export function AssetCard({ asset, viewMode, onEdit }: AssetCardProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="h-6 w-6" />;
      case 'video': return <FileVideo className="h-6 w-6" />;
      case 'pdf':
      case 'document': return <FileText className="h-6 w-6" />;
      default: return <File className="h-6 w-6" />;
    }
  };

  // Use asset.approvalStatus as a string for color, fallback to 'pending'
  const getStatusColor = (status: string) => {
    switch (status || 'pending') {
      case 'approved':
        return 'text-[#D74043] dark:text-[#D74043]';
      case 'pending':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Use asset.confidentiality as a string for color, fallback to 'internal'
  const getConfidentialityColor = (level: string) => {
    switch (level || 'internal') {
      case 'public':
        return 'bg-green-500';
      case 'internal':
        return 'bg-[#3F2B2B]';
      case 'confidential':
        return 'bg-[#D74043]';
      default:
        return 'bg-gray-500';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl hover:bg-secondary/50 transition-colors">
        <div className="flex-shrink-0">
          {asset.thumbnailUrl ? (
            <img src={asset.thumbnailUrl} alt={asset.name} className="w-12 h-12 object-cover rounded-lg" />
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              {getFileIcon(asset.type)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{asset.name}</h3>
          <p className="text-sm text-muted-foreground">{asset.type.toUpperCase()}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={classNames('w-2 h-2 rounded-full', getConfidentialityColor(asset.confidentiality))} />
          <span className={classNames('text-sm font-medium', getStatusColor(asset.approvalStatus))}>
            {asset.approvalStatus}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-secondary rounded-md transition-colors" title="Preview">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-md transition-colors" title="Download">
            <Download className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-md transition-colors" title="Share">
            <Share className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onEdit(asset)}
            className="p-2 hover:bg-secondary rounded-md transition-colors" 
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video bg-muted flex items-center justify-center relative">
        {asset.thumbnailUrl ? (
          <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-muted-foreground">
            {getFileIcon(asset.type)}
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className={classNames('w-3 h-3 rounded-full', getConfidentialityColor(asset.confidentiality))} />
        </div>

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors" title="Preview">
            <Eye className="h-4 w-4 text-white" />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors" title="Download">
            <Download className="h-4 w-4 text-white" />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors" title="Share">
            <Share className="h-4 w-4 text-white" />
          </button>
          <button 
            onClick={() => onEdit(asset)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-md hover:bg-white/30 transition-colors" 
            title="Edit"
          >
            <Edit className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium truncate mb-1">{asset.name}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{asset.type.toUpperCase()}</span>
          <span className={classNames('font-medium', getStatusColor(asset.approvalStatus))}>
            {asset.approvalStatus}
          </span>
        </div>
        
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-secondary text-xs rounded-md">
                {tag}
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="px-2 py-1 bg-secondary text-xs rounded-md">
                +{asset.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Asset, ViewMode, SelectedAssets } from '../lib/types';
import {
  Download, Eye, Share2, MoreVertical, Image, FileText, Video,
  Folder, Play, X, ChevronLeft, ChevronRight, Edit
} from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  viewMode: ViewMode;
  selectedAssets: SelectedAssets;
  onAssetSelect: (assetId: string, selected: boolean) => void;
  onAssetDownload: (asset: Asset) => void;
  onAssetPreview: (asset: Asset) => void;
  onAssetShare: (asset: Asset) => void;
  onAssetEdit: (asset: Asset) => void;
  onTogglePublic?: (assetId: string) => void;
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return Folder;
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.includes('pdf')) return FileText;
  return Folder;
};

const AssetList: React.FC<AssetListProps> = ({ 
  assets, 
  viewMode, 
  selectedAssets,
  onAssetSelect,
  onAssetDownload,
  onAssetPreview,
  onAssetShare,
  onAssetEdit,
  onTogglePublic 
}) => {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    currentIndex: 0,
    assets: [] as Asset[]
  });

  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const openLightbox = (asset: Asset, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const imageAssets = assets.filter(a => a.mimeType?.startsWith('image/'));
    const index = imageAssets.findIndex(a => a.id === asset.id);
    setLightboxState({
      isOpen: true,
      currentIndex: index >= 0 ? index : 0,
      assets: imageAssets
    });
  };

  const closeLightbox = () => {
    setLightboxState(prev => ({ ...prev, isOpen: false }));
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    setLightboxState(prev => ({
      ...prev,
      currentIndex: direction === 'next' 
        ? (prev.currentIndex + 1) % prev.assets.length
        : (prev.currentIndex - 1 + prev.assets.length) % prev.assets.length
    }));
  };

  const handlePreviewClick = (asset: Asset, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (asset.mimeType?.startsWith('image/')) {
      openLightbox(asset);
    } else {
      onAssetPreview(asset);
    }
  };

  const handleDropdownClick = (assetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(dropdownOpen === assetId ? null : assetId);
  };

  const handleMenuAction = (action: () => void, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(null);
    action();
  };

  if (viewMode === 'grid') {
    return (
      <>
        <div className="assets-grid">
          {assets.map((asset) => {
            const FileIcon = getFileIcon(asset.mimeType);
            const isVideo = asset.mimeType?.startsWith('video/');
            const isSelected = selectedAssets[asset.id];

            return (
              <div key={asset.id} className={`asset-item ${isSelected ? 'selected' : ''}`}>
                <div 
                  className="asset-preview" 
                  onClick={(e) => handlePreviewClick(asset, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {asset.thumbnail ? (
                    <img src={asset.thumbnail} alt={asset.name} />
                  ) : (
                    <div className="asset-preview-placeholder">
                      <FileIcon size={32} />
                      <span>{asset.type.toUpperCase()}</span>
                    </div>
                  )}

                  {isVideo && (
                    <div className="video-overlay">
                      <div className="play-button">
                        <Play size={24} fill="white" />
                      </div>
                    </div>
                  )}

                  <div className={`confidentiality-indicator ${asset.confidentiality.toLowerCase()}`}></div>
                  
                  <div className="asset-checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onAssetSelect(asset.id, e.target.checked)}
                    />
                  </div>
                </div>

                <div className="asset-info">
                  <div className="asset-header">
                    <h3 className="asset-title">{asset.name}</h3>
                    <div className="asset-menu">
                      <button
                        className="asset-menu-btn"
                        onClick={(e) => handleDropdownClick(asset.id, e)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {dropdownOpen === asset.id && (
                        <div className="dropdown-menu">
                          <button 
                            className="dropdown-item" 
                            onClick={(e) => handleMenuAction(() => handlePreviewClick(asset, e), e)}
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                          <button 
                            className="dropdown-item" 
                            onClick={(e) => handleMenuAction(() => onAssetEdit(asset), e)}
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button 
                            className="dropdown-item" 
                            onClick={(e) => handleMenuAction(() => onAssetDownload(asset), e)}
                          >
                            <Download size={16} />
                            Download
                          </button>
                          <button 
                            className="dropdown-item" 
                            onClick={(e) => handleMenuAction(() => onAssetShare(asset), e)}
                          >
                            <Share2 size={16} />
                            Share
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="asset-meta">
                    <span className="asset-type-badge">{asset.type.toUpperCase()}</span>
                    <span className="asset-size">{formatFileSize(asset.fileSize)}</span>
                    <span className="asset-date">{new Date(asset.dateAdded).toLocaleDateString()}</span>
                  </div>

                  <div className="asset-tags">
                    {asset.tags?.slice(0, 3).map((tag, index) => (
                      <span key={index} className="asset-tag">{tag}</span>
                    ))}
                    {asset.tags && asset.tags.length > 3 && (
                      <span className="more-tags">+{asset.tags.length - 3} more</span>
                    )}
                  </div>

                  <div className="asset-actions">
                    <span className="confidentiality-label">{asset.confidentiality}</span>
                    <div className="action-buttons">
                      <button 
                        className="action-btn" 
                        onClick={(e) => handlePreviewClick(asset, e)}
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAssetDownload(asset);
                        }}
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onAssetShare(asset);
                        }}
                        title="Share"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {lightboxState.isOpen && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={e => e.stopPropagation()}>
              <button className="lightbox-close" onClick={closeLightbox}>
                <X size={20} />
              </button>
              
              {lightboxState.assets.length > 1 && (
                <>
                  <button className="lightbox-nav lightbox-prev" onClick={() => navigateLightbox('prev')}>
                    <ChevronLeft size={24} />
                  </button>
                  <button className="lightbox-nav lightbox-next" onClick={() => navigateLightbox('next')}>
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="lightbox-media">
                <img 
                  src={lightboxState.assets[lightboxState.currentIndex]?.link} 
                  alt={lightboxState.assets[lightboxState.currentIndex]?.name}
                  className="lightbox-image"
                />
              </div>

              <div className="lightbox-info">
                <div className="lightbox-header">
                  <h2>{lightboxState.assets[lightboxState.currentIndex]?.name}</h2>
                  <div className="lightbox-actions">
                    <button 
                      className="action-btn" 
                      onClick={() => onAssetEdit(lightboxState.assets[lightboxState.currentIndex])}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => onAssetDownload(lightboxState.assets[lightboxState.currentIndex])}
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => onAssetShare(lightboxState.assets[lightboxState.currentIndex])}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="lightbox-metadata">
                  <div className="metadata-grid">
                    <div className="metadata-item">
                      <span className="label">Type</span>
                      <span>{lightboxState.assets[lightboxState.currentIndex]?.type}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="label">Size</span>
                      <span>{formatFileSize(lightboxState.assets[lightboxState.currentIndex]?.fileSize)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="label">Date Added</span>
                      <span>{new Date(lightboxState.assets[lightboxState.currentIndex]?.dateAdded).toLocaleDateString()}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="label">Confidentiality</span>
                      <span>{lightboxState.assets[lightboxState.currentIndex]?.confidentiality}</span>
                    </div>
                  </div>

                  {lightboxState.assets[lightboxState.currentIndex]?.description && (
                    <div className="metadata-description">
                      <span className="label">Description</span>
                      <p>{lightboxState.assets[lightboxState.currentIndex]?.description}</p>
                    </div>
                  )}

                  {lightboxState.assets[lightboxState.currentIndex]?.tags && (
                    <div className="metadata-tags">
                      <span className="label">Tags</span>
                      <div className="tag-list">
                        {lightboxState.assets[lightboxState.currentIndex]?.tags?.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-select toolbar */}
        {Object.values(selectedAssets).some(Boolean) && (
          <div className="multi-select-toolbar">
            <span className="toolbar-text">
              {Object.values(selectedAssets).filter(Boolean).length} items selected
            </span>
            <button className="toolbar-btn">
              <Download size={16} />
              Download
            </button>
            <button className="toolbar-btn secondary">
              <Share2 size={16} />
              Share
            </button>
          </div>
        )}
      </>
    );
  }

  // List view
  return (
    <div className="assets-list">
      {assets.map((asset) => {
        const isSelected = selectedAssets[asset.id];
        
        return (
          <div key={asset.id} className={`asset-list-item ${isSelected ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onAssetSelect(asset.id, e.target.checked)}
            />
            
            <div 
              className="asset-list-preview" 
              onClick={(e) => handlePreviewClick(asset, e)}
              style={{ cursor: 'pointer' }}
            >
              {asset.thumbnail ? (
                <img src={asset.thumbnail} alt={asset.name} />
              ) : (
                <div className="asset-preview-placeholder">
                  {React.createElement(getFileIcon(asset.mimeType), { size: 24 })}
                </div>
              )}
            </div>

            <div className="asset-list-info">
              <h3 className="asset-list-title">{asset.name}</h3>
              <div className="asset-list-meta">
                {asset.category} • {formatFileSize(asset.fileSize)} • {new Date(asset.dateAdded).toLocaleDateString()}
              </div>
              <div className="asset-list-tags">
                {asset.tags?.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag-small">{tag}</span>
                ))}
              </div>
            </div>

            <span className={`status-badge status-${asset.approvalStatus}`}>
              {asset.approvalStatus}
            </span>

            <span className="confidentiality-label">{asset.confidentiality}</span>

            <div className="list-actions">
              <button 
                className="action-btn" 
                onClick={(e) => handlePreviewClick(asset, e)}
                title="Preview"
              >
                <Eye size={16} />
              </button>
              <button 
                className="action-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAssetEdit(asset);
                }}
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button 
                className="action-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAssetDownload(asset);
                }}
                title="Download"
              >
                <Download size={16} />
              </button>
              <button 
                className="action-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAssetShare(asset);
                }}
                title="Share"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetList;
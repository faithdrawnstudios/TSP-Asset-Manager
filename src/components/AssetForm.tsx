'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Asset, AssetType, ConfidentialityLevel, ApprovalStatus } from '../lib/types';

interface AssetFormProps {
  asset?: Asset;
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Partial<Asset>) => void;
}

export function AssetForm({ asset, isOpen, onClose, onSave }: AssetFormProps) {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    dropboxUrl: asset?.dropboxUrl || '',
    type: asset?.type || 'image' as AssetType,
    confidentiality: asset?.confidentiality || 'internal' as ConfidentialityLevel,
    approvalStatus: asset?.approvalStatus || 'pending' as ApprovalStatus,
    tags: asset?.tags.join(', ') || '',
    project: asset?.project || '',
    collection: asset?.collection || '',
    usageNotes: asset?.usageNotes || '',
    expirationDate: asset?.expirationDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assetData: Partial<Asset> = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      dateModified: new Date().toISOString(),
    };

    if (!asset) {
      assetData.id = crypto.randomUUID();
      assetData.dateAdded = new Date().toISOString();
      assetData.versions = [];
    }

    onSave(assetData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Asset Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dropbox URL</label>
            <input
              type="url"
              required
              value={formData.dropboxUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, dropboxUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://dropbox.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssetType }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="psd">PSD</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confidentiality</label>
              <select
                value={formData.confidentiality}
                onChange={(e) => setFormData(prev => ({ ...prev, confidentiality: e.target.value as ConfidentialityLevel }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="confidential">Confidential</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="logo, brand, marketing"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project</label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Collection</label>
              <input
                type="text"
                value={formData.collection}
                onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Usage Notes</label>
            <textarea
              value={formData.usageNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, usageNotes: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expiration Date</label>
            <input
              type="date"
              value={formData.expirationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              {asset ? 'Update Asset' : 'Add Asset'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

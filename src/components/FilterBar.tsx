'use client';

import { Search, Filter } from 'lucide-react';
import { AssetType, ConfidentialityLevel, ApprovalStatus } from '../lib/types';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: AssetType | 'all';
  onTypeChange: (type: AssetType | 'all') => void;
  selectedConfidentiality: ConfidentialityLevel | 'all';
  onConfidentialityChange: (level: ConfidentialityLevel | 'all') => void;
  selectedStatus: ApprovalStatus | 'all';
  onStatusChange: (status: ApprovalStatus | 'all') => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedConfidentiality,
  onConfidentialityChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="px-8 py-6">
      <div className="bg-secondary/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as AssetType | 'all')}
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-32"
            >
              <option value="all">All Types</option>
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
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-32"
            >
              <option value="all">All Levels</option>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="confidential">Confidential</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as ApprovalStatus | 'all')}
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-32"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

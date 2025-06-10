export interface Asset {
  id: string;
  name: string;
  dropboxUrl: string;
  type: AssetType;
  size?: string;
  dateAdded: string;
  dateModified: string;
  confidentiality: ConfidentialityLevel;
  tags: string[];
  approvalStatus: ApprovalStatus;
  project?: string;
  collection?: string;
  expirationDate?: string;
  usageNotes?: string;
  thumbnailUrl?: string;
  versions: AssetVersion[];
}

export interface AssetVersion {
  id: string;
  dropboxUrl: string;
  dateCreated: string;
  notes?: string;
}

export type AssetType = 'image' | 'video' | 'pdf' | 'psd' | 'document' | 'other';

export type ConfidentialityLevel = 'public' | 'internal' | 'confidential';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type ViewMode = 'grid' | 'list';

export type AssetTab = 'all' | 'projects' | 'collections' | 'archived' | 'final' | 'working';

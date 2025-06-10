export interface Asset {
  id: string;
  name: string;
  type: string;
  mimeType: string;
  link: string;
  thumbnail: string;
  confidentiality: 'Public' | 'Internal' | 'Confidential';
  category: 'Brand' | 'Photo' | 'Video' | 'Document' | 'Graphics';
  dateAdded: string;
  dateModified?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  tags?: string[];
  description?: string;
  createdBy?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  downloadCount?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  assetIds: string[];
  permissions: string[];
  dateCreated: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  assetIds: string[];
  status: 'active' | 'completed' | 'archived';
  dueDate: string;
}

export interface FilterState {
  category: string;
  confidentiality: string;
  dateRange: string;
  fileType: string;
  search: string;
}

export interface SortOption {
  field: keyof Asset;
  direction: 'asc' | 'desc';
}

export type ViewMode = 'grid' | 'list';

export interface SelectedAssets {
  [key: string]: boolean;
}

export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  assets: Asset[];
}

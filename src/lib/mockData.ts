import { Asset, Collection, Project } from './types';

export const mockAssets: Asset[] = [
  {
    id: "1",
    name: "FABRICATE Primary Logo",
    type: "image/png",
    mimeType: "image/png",
    link: "https://via.placeholder.com/1920x1080/2563EB/FFFFFF?text=FABRICATE+Logo",
    thumbnail: "https://via.placeholder.com/400x300/2563EB/FFFFFF?text=FABRICATE+Logo",
    confidentiality: "Public",
    category: "Brand",
    dateAdded: "2024-06-01",
    fileSize: 2048000,
    dimensions: { width: 1920, height: 1080 },
    tags: ["logo", "brand", "primary", "identity"],
    description: "Primary FABRICATE logo for use across all marketing materials",
    createdBy: "Design Team",
    approvalStatus: "approved",
    downloadCount: 145
  },
  {
    id: "2",
    name: "Corporate Facility Tour",
    type: "video/mp4",
    mimeType: "video/mp4",
    link: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://via.placeholder.com/400x300/64748B/FFFFFF?text=Facility+Tour",
    confidentiality: "Internal",
    category: "Video",
    dateAdded: "2024-06-02",
    fileSize: 52428800,
    dimensions: { width: 1280, height: 720 },
    tags: ["facility", "tour", "corporate", "overview"],
    description: "Comprehensive facility tour video for new employees and stakeholders",
    createdBy: "HR Department",
    approvalStatus: "approved",
    downloadCount: 89
  },
  {
    id: "3",
    name: "Q3 2024 Marketing Brochure",
    type: "application/pdf",
    mimeType: "application/pdf",
    link: "https://www.example.com/brochure.pdf",
    thumbnail: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Marketing+Brochure",
    confidentiality: "Public",
    category: "Document",
    dateAdded: "2024-06-03",
    fileSize: 1024000,
    tags: ["marketing", "brochure", "Q3", "sales", "product"],
    description: "Comprehensive product marketing brochure for Q3 2024 campaign",
    createdBy: "Marketing Team",
    approvalStatus: "approved",
    downloadCount: 234
  },
  {
    id: "4",
    name: "Product Hero Photography",
    type: "image/jpeg",
    mimeType: "image/jpeg",
    link: "https://via.placeholder.com/2400x1600/F59E0B/FFFFFF?text=Product+Hero",
    thumbnail: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Product+Hero",
    confidentiality: "Public",
    category: "Photo",
    dateAdded: "2024-06-04",
    fileSize: 3072000,
    dimensions: { width: 2400, height: 1600 },
    tags: ["product", "photography", "hero", "catalog", "ecommerce"],
    description: "High-resolution hero product photography for website and marketing",
    createdBy: "Photography Team",
    approvalStatus: "pending",
    downloadCount: 67
  },
  {
    id: "5",
    name: "Executive Board Presentation",
    type: "application/vnd.ms-powerpoint",
    mimeType: "application/vnd.ms-powerpoint",
    link: "https://www.example.com/presentation.pptx",
    thumbnail: "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Board+Presentation",
    confidentiality: "Confidential",
    category: "Document",
    dateAdded: "2024-06-05",
    fileSize: 5120000,
    tags: ["presentation", "board", "executive", "strategic", "confidential"],
    description: "Strategic executive presentation for quarterly board meeting",
    createdBy: "Executive Team",
    approvalStatus: "approved",
    downloadCount: 12
  },
  {
    id: "6",
    name: "Social Media Graphics Pack",
    type: "image/png",
    mimeType: "image/png",
    link: "https://via.placeholder.com/1080x1080/8B5CF6/FFFFFF?text=Social+Graphics",
    thumbnail: "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Social+Graphics",
    confidentiality: "Public",
    category: "Graphics",
    dateAdded: "2024-06-06",
    fileSize: 1536000,
    dimensions: { width: 1080, height: 1080 },
    tags: ["social", "graphics", "instagram", "facebook", "twitter"],
    description: "Social media graphics pack for Q3 campaign across all platforms",
    createdBy: "Design Team",
    approvalStatus: "approved",
    downloadCount: 178
  },
  {
    id: "7",
    name: "Brand Guidelines Document",
    type: "application/pdf",
    mimeType: "application/pdf",
    link: "https://www.example.com/brand-guidelines.pdf",
    thumbnail: "https://via.placeholder.com/400x300/2563EB/FFFFFF?text=Brand+Guidelines",
    confidentiality: "Internal",
    category: "Brand",
    dateAdded: "2024-06-07",
    fileSize: 2560000,
    tags: ["brand", "guidelines", "identity", "standards", "typography"],
    description: "Comprehensive brand guidelines and identity standards",
    createdBy: "Brand Team",
    approvalStatus: "approved",
    downloadCount: 156
  },
  {
    id: "8",
    name: "Customer Testimonial Video",
    type: "video/mp4",
    mimeType: "video/mp4",
    link: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Testimonial",
    confidentiality: "Public",
    category: "Video",
    dateAdded: "2024-06-08",
    fileSize: 25600000,
    dimensions: { width: 1920, height: 1080 },
    tags: ["testimonial", "customer", "video", "marketing", "success"],
    description: "Customer success story and testimonial video for marketing use",
    createdBy: "Video Production Team",
    approvalStatus: "approved",
    downloadCount: 98
  }
];

export const categories = [
  'All Types',
  'Brand',
  'Photo', 
  'Video',
  'Document',
  'Graphics'
];

export const confidentialityLevels = [
  'All',
  'Public',
  'Internal', 
  'Confidential'
];

export const sortOptions = [
  { label: 'Name A-Z', field: 'name' as keyof Asset, direction: 'asc' as const },
  { label: 'Name Z-A', field: 'name' as keyof Asset, direction: 'desc' as const },
  { label: 'Date Added (Newest)', field: 'dateAdded' as keyof Asset, direction: 'desc' as const },
  { label: 'Date Added (Oldest)', field: 'dateAdded' as keyof Asset, direction: 'asc' as const },
  { label: 'Most Downloaded', field: 'downloadCount' as keyof Asset, direction: 'desc' as const }
];

export const mockCollections: Collection[] = [
  {
    id: "c1",
    name: "Brand Assets",
    description: "Official brand assets including logos, colors, and guidelines",
    assetIds: ["1", "7"],
    permissions: ["public"],
    dateCreated: "2024-05-01"
  },
  {
    id: "c2",
    name: "Marketing Campaign Q3",
    description: "All assets for Q3 2024 marketing campaign",
    assetIds: ["3", "6", "8"],
    permissions: ["marketing", "sales"],
    dateCreated: "2024-05-15"
  },
  {
    id: "c3",
    name: "Product Photography",
    description: "High-quality product photos and lifestyle shots",
    assetIds: ["4"],
    permissions: ["marketing", "ecommerce", "design"],
    dateCreated: "2024-05-20"
  }
];

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Brand Refresh 2024",
    description: "Complete brand refresh and identity redesign project",
    assetIds: ["1", "7"],
    status: "active",
    dueDate: "2024-08-31"
  },
  {
    id: "p2",
    name: "Q3 Product Launch",
    description: "New product launch campaign for Q3 2024",
    assetIds: ["3", "4", "6", "8"],
    status: "active",
    dueDate: "2024-07-15"
  },
  {
    id: "p3",
    name: "Internal Communications Update",
    description: "Update internal communication materials and videos",
    assetIds: ["2"],
    status: "completed",
    dueDate: "2024-06-30"
  }
];

export interface WordPressAsset {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  acf?: {
    asset_type: string;
    confidentiality: string;
    file_url: string;
    thumbnail_url: string;
    file_size: number;
    dimensions: { width: number; height: number };
    tags: string[];
    approval_status: string;
  };
  date: string;
  modified: string;
}

export class WordPressAPI {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.authToken = authToken;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const response = await fetch(`${this.baseUrl}/wp-json/wp/v2${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAssets(params: {
    search?: string;
    category?: string;
    per_page?: number;
    page?: number;
  } = {}): Promise<WordPressAsset[]> {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.category && params.category !== 'All Types') {
      searchParams.append('categories', params.category);
    }
    searchParams.append('per_page', (params.per_page || 50).toString());
    searchParams.append('page', (params.page || 1).toString());

    return this.fetchWithAuth(`/posts?${searchParams.toString()}`);
  }

  async uploadAsset(file: File, metadata: {
    title: string;
    description?: string;
    asset_type: string;
    confidentiality: string;
    tags?: string[];
  }): Promise<WordPressAsset> {
    // First upload the file to WordPress media library
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', metadata.title);
    
    const mediaResponse = await fetch(`${this.baseUrl}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
      },
      body: formData,
    });

    if (!mediaResponse.ok) {
      throw new Error('Failed to upload file');
    }

    const mediaData = await mediaResponse.json();

    // Then create a post with the asset metadata
    const postData = {
      title: metadata.title,
      content: metadata.description || '',
      status: 'publish',
      featured_media: mediaData.id,
      acf: {
        asset_type: metadata.asset_type,
        confidentiality: metadata.confidentiality,
        file_url: mediaData.source_url,
        thumbnail_url: mediaData.media_details?.sizes?.thumbnail?.source_url || mediaData.source_url,
        file_size: mediaData.media_details?.filesize || 0,
        dimensions: {
          width: mediaData.media_details?.width || 0,
          height: mediaData.media_details?.height || 0,
        },
        tags: metadata.tags || [],
        approval_status: 'pending',
      },
    };

    return this.fetchWithAuth('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updateAsset(id: number, updates: Partial<WordPressAsset['acf']>): Promise<WordPressAsset> {
    return this.fetchWithAuth(`/posts/${id}`, {
      method: 'POST',
      body: JSON.stringify({ acf: updates }),
    });
  }

  async deleteAsset(id: number): Promise<void> {
    await this.fetchWithAuth(`/posts/${id}`, {
      method: 'DELETE',
    });
  }
}

// Transform WordPress asset to your Asset interface
export function transformWordPressAsset(wpAsset: WordPressAsset): Asset {
  return {
    id: wpAsset.id.toString(),
    name: wpAsset.title.rendered,
    type: wpAsset.acf?.asset_type || 'unknown',
    mimeType: '', // You'd get this from media details
    link: wpAsset.acf?.file_url || '',
    thumbnail: wpAsset.acf?.thumbnail_url || '',
    confidentiality: (wpAsset.acf?.confidentiality as any) || 'Public',
    category: (wpAsset.acf?.asset_type as any) || 'Document',
    dateAdded: wpAsset.date,
    dateModified: wpAsset.modified,
    fileSize: wpAsset.acf?.file_size,
    dimensions: wpAsset.acf?.dimensions,
    tags: wpAsset.acf?.tags || [],
    description: wpAsset.content.rendered.replace(/<[^>]*>/g, ''), // Strip HTML
    approvalStatus: (wpAsset.acf?.approval_status as any) || 'pending',
  };
}

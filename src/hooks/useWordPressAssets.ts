import { useState, useEffect } from 'react';
import { Asset } from '@/lib/types';

interface UseWordPressAssetsOptions {
  wordpressUrl: string;
  authToken?: string;
  isPublicPortal?: boolean;
}

export function useWordPressAssets(options: UseWordPressAssetsOptions) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const apiBase = `${options.wordpressUrl}/wp-json/tsp-dam/v1`;
  const endpoint = options.isPublicPortal ? `${apiBase}/assets/public` : `${apiBase}/assets`;

  const fetchAssets = async (params?: {
    search?: string;
    category?: string;
    page?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.category && params.category !== 'All Types') {
        searchParams.append('category', params.category);
      }
      if (params?.page) searchParams.append('page', params.page.toString());
      
      const url = `${endpoint}?${searchParams.toString()}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (options.authToken && !options.isPublicPortal) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
      }
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const wpAssets = await response.json();
      setAssets(wpAssets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
      console.error('Error fetching WordPress assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadAsset = async (file: File, metadata: {
    title: string;
    description?: string;
    asset_type: string;
    confidentiality: string;
    tags?: string[];
  }) => {
    if (options.isPublicPortal) {
      throw new Error('Upload not allowed in public portal');
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const headers: HeadersInit = {};
      if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`;
      }
      
      // Upload file and create asset
      const response = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload asset');
      }
      
      const newAsset = await response.json();
      setAssets(prev => [newAsset, ...prev]);
      return newAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload asset');
      throw err;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [endpoint]);

  return {
    assets,
    loading,
    error,
    fetchAssets,
    uploadAsset: options.isPublicPortal ? undefined : uploadAsset,
    refetch: fetchAssets,
  };
}

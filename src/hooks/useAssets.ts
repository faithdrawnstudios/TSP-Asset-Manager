import { useState, useEffect } from 'react';
import { Asset } from '../lib/types';
import { mockAssets } from '../lib/mockData';

const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      // Simulate fetching data from an API or Dropbox
      // In a real application, you would replace this with an actual API call
      const response = await new Promise<Asset[]>((resolve) => {
        setTimeout(() => resolve(mockAssets), 1000);
      });
      setAssets(response);
    } catch (err) {
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return { assets, loading, error };
};

export default useAssets;
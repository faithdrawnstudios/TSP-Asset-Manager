import { useState, useEffect } from 'react';

const useSearch = (assets) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assets);

  useEffect(() => {
    const results = assets.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAssets(results);
  }, [searchTerm, assets]);

  return { searchTerm, setSearchTerm, filteredAssets };
};

export default useSearch;
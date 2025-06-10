import React from 'react';

interface AssetCardProps {
  id: string;
  name: string;
  type: string;
  link: string;
  thumbnail: string;
  confidentiality: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ id, name, type, link, thumbnail, confidentiality }) => {
  return (
    <div className="flex flex-col border rounded shadow-md overflow-hidden">
      <img src={thumbnail} alt={name} className="h-32 w-full object-cover" />
      <div className="p-2">
        <p className="font-semibold text-sm truncate">{name}</p>
        <p className="text-xs text-muted">{type}</p>
        <p className="text-xs">{confidentiality}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-xs underline"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default AssetCard;
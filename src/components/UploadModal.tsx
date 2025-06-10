import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

const UploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Handle the upload logic here
    console.log('Uploading:', { file, name, type });
    onClose(); // Close the modal after upload
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-bold">Upload New Asset</h2>
        <Input
          type="text"
          placeholder="Asset Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2"
        />
        <Input
          type="text"
          placeholder="Asset Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-2"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="mt-2"
        />
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="ghost">Cancel</Button>
          <Button onClick={handleUpload} className="ml-2">Upload</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadModal;
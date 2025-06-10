import React from 'react';
import { Select } from './ui/select';
import { Button } from './ui/button';

const FilterPanel = ({ categories, onFilterChange }) => {
  return (
    <div className="flex gap-4 p-4 border rounded">
      <Select
        options={categories}
        onChange={(e) => onFilterChange('category', e.target.value)}
        placeholder="Select Category"
      />
      <Select
        options={[
          { value: 'Public', label: 'Public' },
          { value: 'Internal', label: 'Internal' },
          { value: 'Confidential', label: 'Confidential' },
        ]}
        onChange={(e) => onFilterChange('confidentiality', e.target.value)}
        placeholder="Select Confidentiality"
      />
      <Button onClick={() => onFilterChange('reset')}>Reset Filters</Button>
    </div>
  );
};

export default FilterPanel;
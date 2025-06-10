'use client';

import { Grid, List } from 'lucide-react';
import { ViewMode } from '../lib/types';
import classNames from 'classnames';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex border border-border rounded-md">
      <button
        onClick={() => onViewModeChange('grid')}
        className={classNames(
          'p-2 rounded-l-md transition-colors',
          viewMode === 'grid'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-secondary'
        )}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={classNames(
          'p-2 rounded-r-md transition-colors',
          viewMode === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-secondary'
        )}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

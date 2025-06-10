'use client';

import { Plus, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onAddAsset: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ onAddAsset, searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TSP</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Asset Manager</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-80"
              />
            </div>
            <ThemeToggle />
            <button
              onClick={onAddAsset}
              className="flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Asset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

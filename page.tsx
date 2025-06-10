// NEXT.JS DIGITAL ASSET MANAGER (Dropbox-Linked)
// Full frontend structure (no backend storage)
// Features: upload, Dropbox link editing, metadata, search, filters, views, dark/light, no auth yet

"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, UploadCloud, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const mockAssets = [
  {
    id: "1",
    name: "Logo on background",
    type: "image/png",
    link: "https://www.dropbox.com/s/example1",
    thumbnail: "/placeholder-logo.png",
    confidentiality: "Public",
    category: "Brand",
    dateAdded: "2024-06-01",
  },
  {
    id: "2",
    name: "Facility tour",
    type: "image/jpg",
    link: "https://www.dropbox.com/s/example2",
    thumbnail: "/placeholder-facility.jpg",
    confidentiality: "Internal",
    category: "Photo",
    dateAdded: "2024-06-02",
  },
];

export default function DAMDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [assets, setAssets] = useState(mockAssets);
  const [search, setSearch] = useState("");

  const toggleTheme = () => setDarkMode(!darkMode);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "bg-black text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      <header className="flex justify-between items-center p-4 shadow">
        <h1 className="text-xl font-bold">FABRICATE</h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search for assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={toggleTheme} variant="ghost">
            {darkMode ? <Sun /> : <Moon />}
          </Button>
          <Button className="bg-blue-600 text-white flex gap-2">
            <UploadCloud className="w-4 h-4" /> Upload media
          </Button>
        </div>
      </header>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm">{filteredAssets.length} Results</p>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "ghost"}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "ghost"}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <Card key={asset.id}>
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="h-32 w-full object-cover"
                />
                <CardContent className="p-2">
                  <p className="font-semibold text-sm truncate">{asset.name}</p>
                  <p className="text-xs text-muted">{asset.confidentiality}</p>
                  <a
                    href={asset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-xs underline"
                  >
                    Download
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-4 p-2 border rounded"
              >
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{asset.name}</p>
                  <p className="text-xs text-muted">{asset.type}</p>
                  <p className="text-xs">{asset.confidentiality}</p>
                </div>
                <a
                  href={asset.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

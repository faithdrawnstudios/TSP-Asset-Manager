# Digital Asset Manager

## Overview
This project is a Digital Asset Manager (DAM) that utilizes Dropbox links for storage. It provides a user-friendly interface for managing digital assets with features such as light/dark mode, upload functionality, search, filters, and a visual layout builder.

## Features
- **Light/Dark Mode**: Users can toggle between light and dark themes for better visibility and comfort.
- **Upload Functionality**: Users can upload new assets directly to the application.
- **Search**: A search bar allows users to quickly find assets by name.
- **Filters**: Users can filter assets based on various criteria such as type and confidentiality.
- **Visual Layout Builder**: Users can switch between grid and list views for asset display.

## Project Structure
```
digital-asset-manager
├── src
│   ├── app
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── favicon.ico
│   ├── components
│   │   ├── ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── badge.tsx
│   │   ├── AssetCard.tsx
│   │   ├── AssetList.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── UploadModal.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ViewModeToggle.tsx
│   ├── lib
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── mockData.ts
│   ├── hooks
│   │   ├── useAssets.ts
│   │   ├── useTheme.ts
│   │   └── useSearch.ts
│   └── styles
│       └── components.css
├── public
│   ├── placeholder-logo.png
│   └── placeholder-facility.jpg
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

## Getting Started
To get started with the Digital Asset Manager, follow these steps:

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd digital-asset-manager
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run the Development Server**:
   ```
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
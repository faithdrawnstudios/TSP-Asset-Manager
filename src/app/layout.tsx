import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Digital Asset Manager',
  description: 'A Digital Asset Manager that integrates with Dropbox for asset storage.',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
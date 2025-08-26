'use client';
import HomeContext from '@/contexts/HomeContext';
import React, { useContext } from 'react'

function Loader() {
  const { websiteModificationData } = useContext(HomeContext);

  const loaderColor = websiteModificationData?.json_log?.[0]?.buttonBackgroundColor || '#000'; // fallback to black

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div
        className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${loaderColor}`, borderTopColor: 'transparent' }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}


export default Loader
'use client';
import HomeContext from '@/contexts/HomeContext';
import React, { useContext } from 'react'

function Loader() {
  const { websiteModificationData } = useContext(HomeContext);

  const loaderColor = websiteModificationData?.json_log?.[0]?.buttonBackgroundColor || '#000'; // fallback to black

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div
        className="h-8 w-8 rounded-full border-4 border-solid animate-spin"
        style={{
          borderColor: `${loaderColor} transparent transparent transparent`,
        }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>

  );
}


export default Loader
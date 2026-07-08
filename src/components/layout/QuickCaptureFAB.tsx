"use client";

import { Plus } from "lucide-react";

export function QuickCaptureFAB() {
  const handleOpenCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <button 
      onClick={handleOpenCommandPalette}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-50 lg:hidden"
    >
      <Plus size={24} />
    </button>
  );
}

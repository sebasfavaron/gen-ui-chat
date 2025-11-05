import React from 'react';
import type { UiMode } from '../types';

interface ModeToggleProps {
  uiMode: UiMode;
  setUiMode: (mode: UiMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  uiMode,
  setUiMode,
}) => {
  const isGenerative = uiMode === 'generative-ui';

  const toggleMode = () => {
    setUiMode(isGenerative ? 'text-only' : 'generative-ui');
  };

  return (
    <div className='flex justify-center items-center py-3 bg-gray-800'>
      <label htmlFor='mode-toggle' className='flex items-center cursor-pointer'>
        <span
          className={`mr-3 font-medium ${
            !isGenerative ? 'text-cyan-400' : 'text-gray-400'
          }`}
        >
          Text Only
        </span>
        <div className='relative'>
          <input
            type='checkbox'
            id='mode-toggle'
            className='sr-only'
            checked={isGenerative}
            onChange={toggleMode}
          />
          <div className='block bg-gray-600 w-14 h-8 rounded-full'></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              isGenerative ? 'transform translate-x-full bg-cyan-400' : ''
            }`}
          ></div>
        </div>
        <span
          className={`ml-3 font-medium ${
            isGenerative ? 'text-cyan-400' : 'text-gray-400'
          }`}
        >
          Gen UI
        </span>
      </label>
    </div>
  );
};

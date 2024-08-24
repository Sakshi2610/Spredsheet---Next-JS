"use client";

import { useState } from 'react';
import useSpreadsheetStore from '../store/spreadsheetStore';
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaFont, FaSearch, FaUndo, FaRedo } from 'react-icons/fa';

const Navbar = ({ selectedCellIndex }) => {
  const [selectedAlignment, setSelectedAlignment] = useState('left');
  const [selectedFontSize, setSelectedFontSize] = useState('text-base');
  const { updateCellFormat, setSearchTerm, undo, redo } = useSpreadsheetStore();

  const handleAlignmentChange = (alignment) => {
    setSelectedAlignment(alignment);
    if (selectedCellIndex !== null) {
      updateCellFormat(selectedCellIndex, alignment, selectedFontSize);
    }
  };

  const handleFontSizeChange = (fontSize) => {
    setSelectedFontSize(fontSize);
    if (selectedCellIndex !== null) {
      updateCellFormat(selectedCellIndex, selectedAlignment, fontSize);
    }
  };
console.log(selectedFontSize)
  return (
    <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex space-x-20 ">
        <div className='flex items-center space-x-8 '>
          <button onClick={() => handleAlignmentChange('left')}>
            <FaAlignLeft />
          </button>
          <button onClick={() => handleAlignmentChange('center')}>
            <FaAlignCenter />
          </button>
          <button onClick={() => handleAlignmentChange('right')}>
            <FaAlignRight />
          </button>
        </div>
        <div className='flex items-center space-x-8'>
          <button onClick={() => handleFontSizeChange('text-sm')}>
            <FaFont className="text-sm" />
          </button>
          <button onClick={() => handleFontSizeChange('text-base')}>
            <FaFont className="text-base" />
          </button>
          <button onClick={() => handleFontSizeChange('text-lg')}>
            <FaFont className="text-lg" />
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-1 border border-gray-500 rounded text-black w-[300px]"
        />
        <button onClick={undo} disabled={false} className="p-2 bg-gray-600 rounded">
          <FaUndo />
        </button>
        <button onClick={redo} disabled={false} className="p-2 bg-gray-600 rounded">
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

export default Navbar;

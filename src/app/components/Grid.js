"use client";

import Navbar from "./Navbar";
import useSpreadsheetStore from "../store/spreadsheetStore";
import { useRef, useEffect, useState } from "react";
import React from 'react';

const Grid = () => {
  const {
    data,
    updateCell,
    searchTerm,
    loadMoreData,
    hasMore,
    currentPage,
    pageSize,
  } = useSpreadsheetStore();

  const containerRef = useRef(null);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);

  const handleCellChange = (index, value) => updateCell(index, value);
  const handleCellClick = (index) => setSelectedCellIndex(index);

  // Filter and paginate data
  const filteredData = data.filter((cell) => cell.value.includes(searchTerm));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const totalColumns = 10; 
  const totalRows = pageSize; // Use pageSize for the number of rows

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      if (scrollHeight - scrollTop <= clientHeight && hasMore) {
        loadMoreData();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, currentPage]);

  return (
    <div>
      <Navbar selectedCellIndex={selectedCellIndex} />
      <div className="overflow-auto" style={{ height: "80vh" }}>
        <div
          ref={containerRef}
          className="grid"
          style={{
            gridTemplateColumns: `50px repeat(${totalColumns}, 1fr)`,
            width: "100%", // Adjust width as needed
          }}
        >
          {Array.from({ length: totalRows }, (_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div
                className="bg-gray-200 flex items-center justify-center border-b border-gray-300"
                style={{
                  height: "40px",
                  padding: "0 8px",
                  position: "sticky",
                  left: 0,
                  zIndex: 10,
                }}
              >
                {rowIndex + 1}
              </div>

              {Array.from({ length: totalColumns }, (_, colIndex) => {
                const cellIndex = rowIndex * totalColumns + colIndex;
                return (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    value={paginatedData[cellIndex]?.value || ""}
                    onClick={() => handleCellClick(cellIndex)}
                    onChange={(e) =>
                      handleCellChange(cellIndex, e.target.value)
                    }
                    style={{
                      textAlign:
                        paginatedData[cellIndex]?.alignment || "left",
                      height: "40px",
                    }}
                    className={`border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${paginatedData[cellIndex]?.fontSize || "text-base"}`}
                  />
                );
              })}
            </React.Fragment>
          ))}

          {!hasMore && (
            <div className="col-span-10 text-center py-2">No more data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Grid;

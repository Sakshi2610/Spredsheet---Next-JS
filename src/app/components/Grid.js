"use client";
import Navbar from "./Navbar";
import useSpreadsheetStore from "../store/spreadsheetStore";
import { useRef, useEffect, useState } from "react";
import React from "react";

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

  const handleCellChange = (index, value) => {
    console.log(`Updating cell at index: ${index} with value: ${value}`);
    updateCell(index, value);
  };

  const handleCellClick = (index) => {
    console.log(`Cell clicked at index: ${index}`);
    setSelectedCellIndex(index);
  };

  const filteredData = data.filter((cell, index) => {
    if (searchTerm) {
      return cell?.value?.includes(searchTerm);
    }
    return true;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  console.log("Filtered Data Length:", filteredData.length);
  console.log("Paginated Data Length:", paginatedData.length);
  console.log("Start Index:", startIndex);

  const totalColumns = 10;
  const totalRows = pageSize;

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      console.log("Scroll event:", { scrollTop, clientHeight, scrollHeight });
      if (scrollHeight - scrollTop <= clientHeight && hasMore) {
        console.log("Loading more data...");
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
            width: "100%",
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
                {startIndex + rowIndex + 1}
              </div>

              {Array.from({ length: totalColumns }, (_, colIndex) => {
                const originalCellIndex =
                  (startIndex + rowIndex) * totalColumns + colIndex;
                const cellValue = data[originalCellIndex]?.value || "";
                const isHighlighted =
                  searchTerm && cellValue?.includes(searchTerm);

                return (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    value={cellValue}
                    onClick={() => handleCellClick(originalCellIndex)}
                    onChange={(e) =>
                      handleCellChange(originalCellIndex, e.target.value)
                    }
                    style={{
                      textAlign:
                        data[originalCellIndex]?.alignment || "left",
                      height: "40px",
                    }}
                    className={`border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      data[originalCellIndex]?.fontSize || "text-base"
                    } ${isHighlighted ? "bg-yellow-300" : ""}`}
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

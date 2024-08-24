import { create } from 'zustand';

const useSpreadsheetStore = create((set) => ({
  data: Array(1000).fill('').map(() => ({
    value: '',
    alignment: 'left',
    fontSize: 'text-base',
  })),
  searchTerm: '',
  pageSize: 1000,
  currentPage: 1,
  hasMore: true, 
  history: [],
  redoStack: [],

  updateCell: (index, value) => set((state) => {
    const newData = [...state.data];
    newData[index] = { ...newData[index], value };
    return {
      data: newData,
      history: [...state.history, state.data],
      redoStack: [],
    };
  }),

  updateCellFormat: (index, alignment, fontSize) => set((state) => {
    const newData = [...state.data];
    newData[index] = { ...newData[index], alignment, fontSize };
    return { data: newData };
  }),

  setSearchTerm: (term) => set({ searchTerm: term }),

  loadMoreData: () => set((state) => {
    if (!state.hasMore) return {};

    const newPage = state.currentPage + 1;
    const startIndex = newPage * state.pageSize;
    const endIndex = startIndex + state.pageSize;

    if (endIndex >= state.data.length) {
      return { currentPage: newPage, hasMore: false };
    }

    return { currentPage: newPage };
  }),

  undo: () => set((state) => {
    if (state.history.length === 0) return {};
    const newHistory = [...state.history];
    const previousState = newHistory.pop();
    return {
      data: previousState,
      history: newHistory,
      redoStack: [state.data, ...state.redoStack],
    };
  }),

  redo: () => set((state) => {
    if (state.redoStack.length === 0) return {};
    const redoStack = [...state.redoStack];
    const nextState = redoStack.shift();
    return {
      data: nextState,
      history: [...state.history, state.data],
      redoStack,
    };
  }),
}));

export default useSpreadsheetStore;

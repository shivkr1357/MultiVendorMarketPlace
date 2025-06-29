import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoading: boolean;
  sidebarOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const initialState: UIState = {
  isLoading: false,
  sidebarOpen: false,
  searchQuery: "",
  selectedCategory: "",
  sortBy: "name",
  sortOrder: "asc",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "";
      state.sortBy = "name";
      state.sortOrder = "asc";
    },
  },
});

export const {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  clearFilters,
} = uiSlice.actions;

export default uiSlice.reducer;

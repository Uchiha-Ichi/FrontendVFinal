
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Gọi API gợi ý ga theo từ khóa nhập vào
export const fetchStationSuggestions = createAsyncThunk(
  "stationAutoComplete/fetch",
  async (query, { rejectWithValue }) => {
    try {
      if (!query) return [];
      const response = await axios.get(`${API_BASE_URL}station/suggest`, {
        params: { keyword: query },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Lỗi khi tìm kiếm ga");
    }
  }
);

export const fetchAllStations = createAsyncThunk(
  "stationAutoComplete/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}station/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue("Lỗi khi lấy danh sách ga");
    }
  }
);

const stationAutoCompleteSlice = createSlice({
  name: "stationAutoComplete",
  initialState: {
    suggestions: [],
    allStations: [],
    loading: false,
    error: null,
    activeField: null, // Thêm activeField vào initialState
  },
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    setActiveField: (state, action) => { // Thêm reducer setActiveField
      state.activeField = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStationSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStationSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchStationSuggestions.rejected, (state) => {
        state.loading = false;
        state.suggestions = [];
      })
      // Xử lý fetchAllStations
      .addCase(fetchAllStations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStations.fulfilled, (state, action) => {
        state.loading = false;
        state.allStations = action.payload;
      })
      .addCase(fetchAllStations.rejected, (state) => {
        state.loading = false;
        state.allStations = [];
      });
  },
});

// Export actions
export const { clearSuggestions, setActiveField } = stationAutoCompleteSlice.actions;
export default stationAutoCompleteSlice.reducer;

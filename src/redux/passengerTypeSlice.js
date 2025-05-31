import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk để fetch danh sách đối tượng hành khách
export const fetchPassengerTypes = createAsyncThunk(
  "passengerType/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}passenger-types`);
      console.log(response.data.result);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Lỗi khi lấy thông tin đối tượng hành khách"
      );
    }
  }
);

// Slice
const passengerTypeSlice = createSlice({
  name: "passengerType",
  initialState: {
    types: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPassengerTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassengerTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchPassengerTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default passengerTypeSlice.reducer;

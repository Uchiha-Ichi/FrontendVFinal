import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Lấy danh sách toa và ghế theo tripId
export const fetchCarriagesByTrip = createAsyncThunk(
  "carriage/fetchCarriagesByTrip",
  async ({ tripId, departureStationId, arrivalStationId }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${API_BASE_URL}trains/${tripId}/carriages`, {
        tripId,
        departureStationId,
        arrivalStationId,
      });
      return { tripId, carriages: response.data.carriages };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy danh sách toa");
    }
  }
);

const carriageSlice = createSlice({
  name: "carriage",
  initialState: {
    carriages: {}, // Danh sách toa và ghế theo tripId
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarriagesByTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarriagesByTrip.fulfilled, (state, action) => {
        state.loading = false;
        const { tripId, carriages } = action.payload;
        state.carriages[tripId] = carriages;
      })
      .addCase(fetchCarriagesByTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carriageSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSeat = createAsyncThunk(
  "seat/fetchSeat",
  async ({ tripId, from, to }, { rejectWithValue }) => {
    try {
      console.log("tripId", tripId);
      const response = await axios.get(`${API_BASE_URL}trips/${tripId}/seats`, {
        params: { from, to },
      });
      console.log(response.data);
      return response.data; // Danh sách ghế từ API
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy thông tin vé"
      );
    }
  }
);

const seatSlice = createSlice({
  name: "seat",
  initialState: {
    seats: [],
    selectedSeats: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    selectSeat: (state, action) => {
      const {
        id,
        seatName,
        stt,
        price,
        tripId,
        trainName,
        departureStation,
        arrivalStation,
        departureTime,
        arrivalTime,
        expire,
      } = action.payload;

      const seatIndex = state.selectedSeats.findIndex((seat) => seat.id === id);

      if (seatIndex !== -1) {
        // Bỏ chọn ghế
        state.totalPrice -= state.selectedSeats[seatIndex].price;
        state.selectedSeats.splice(seatIndex, 1);
      } else {
        // Chọn ghế
        state.selectedSeats.push({
          id,
          seatName,
          stt,
          price,
          trainName,
          tripId,
          expire,
          departureStation,
          arrivalStation,
          departureTime,
          arrivalTime,
        });
        state.totalPrice += price;
      }
    },

    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
      state.totalPrice = 0;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeat.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectSeat, clearSelectedSeats } = seatSlice.actions;
export default seatSlice.reducer;

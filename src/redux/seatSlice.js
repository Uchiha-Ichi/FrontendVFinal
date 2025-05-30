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
      return response.data; // Giả sử là 1 mảng các ghế luôn
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
    seats: [], // Danh sách ghế (mảng)
    selectedSeats: [], // Danh sách ghế đã chọn (mảng đối tượng)
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    selectSeat: (state, action) => {
      const {
        seatId,
        seatName,
        stt,
        ticketPrice,
        reservation,
        departureTime,
        expire,
      } = action.payload;

      const seatIndex = state.selectedSeats.findIndex(
        (seat) => seat.seatId === seatId
      );

      if (seatIndex !== -1) {
        // Bỏ chọn ghế
        state.selectedSeats.splice(seatIndex, 1);
        state.totalPrice -= ticketPrice;
      } else {
        // Chọn ghế
        state.selectedSeats.push({
          seatId,
          seatName,
          stt,
          ticketPrice,
          reservation,
          departureTime,
          expire,
        });
        state.totalPrice += ticketPrice;
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

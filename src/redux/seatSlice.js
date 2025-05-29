import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchSeat = createAsyncThunk(
  "fetchSeat/fetch",
  async ({ tripId, from, to }, { rejectWithValue }) => {
    try {
       console.log("tripId", tripId);
      const response = await axios.post(
        `${API_BASE_URL}carriages/seats`,
        {
          tripId: tripId,
          departureStation: from,
          arrivalStation: to,
        }
      );
      console.log(response.data);
      return response.data;
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
    seats: [], // Danh sách ghế
    carriages: [], // Danh sách toa
    selectedSeats: [], // Danh sách seatId của các ghế được chọn
    totalPrice: 0,
  },
  reducers: {
    selectSeat: (state, action) => {
      const { seatId, seatName, stt, ticketPrice, reservation, departureTime, 
        expire } = action.payload; // seatId và ticketPrice từ action

      // Kiểm tra xem ghế đã được chọn chưa
      const seatIndex = state.selectedSeats.findIndex(
        (seat) => seat.seatId === seatId
      );

      if (seatIndex !== -1) {
        console.log("Ghế đã được xoa:", seatName);
        // Nếu ghế đã được chọn, bỏ chọn ghế và trừ đi giá trị của ghế
        state.selectedSeats = state.selectedSeats.filter(
          (seat) => seat.seatId !== seatId
        );
        state.totalPrice -= ticketPrice;
      } else {
        // Nếu ghế chưa được chọn, thêm ghế vào danh sách và cộng thêm giá trị của ghế
        state.selectedSeats.push({ seatId, seatName, stt, ticketPrice, reservation, departureTime, expire });
        state.totalPrice += ticketPrice;
      }
    },

    // Xóa tất cả ghế đã chọn
    clearSelectedSeats: (state) => {
      state.selectedSeats = []; // Xóa tất cả ghế đã chọn
      state.totalPrice = 0; // Đặt lại tổng tiền về 0
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
        // state.seats = action.payload;
        state.carriages = action.payload.carriages.map((carriage) => {
          carriage.seats.sort((a, b) => a.seatId - b.seatId);
          return carriage;
        });
      })
      .addCase(fetchSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectSeat, clearSelectedSeats } = seatSlice.actions;
export default seatSlice.reducer;

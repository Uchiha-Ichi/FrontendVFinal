import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Action async để lấy thông tin đặt vé từ API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchTicketReservation = createAsyncThunk(
    "ticketReservation/fetch",
    async (id, { rejectWithValue }) => {
        try {

            const response = await axios.get(
                `${API_BASE_URL}tickets/getReservation`,
                {
                    params: { id },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi lấy thông tin vé"
            );
        }
    }
);

export const reserveTicket = createAsyncThunk(
    "ticketReservation/reserveTicket",
    async (ticketReservationDTO, { rejectWithValue }) => {
        try {
            console.log("ticketReservationDTO", `${API_BASE_URL}ticketReservation/reserve`);
            const response = await axios.post(`${API_BASE_URL}tickets/reserve`, ticketReservationDTO);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "L��i khi đặt vé");
        }
    }
)
export const deleteReserveTicket = createAsyncThunk(
    "ticketReservation/deleteReserveTicket",
    async (ticketReservationDTO, { rejectWithValue }) => {
        try {
            // console.log("ticketReservationDTO", ticketReservationDTO);
            const response = await axios.post(`${API_BASE_URL}tickets/deleteReserve`, ticketReservationDTO);
            console.log("deleteReserveTicket", response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "L��i khi đặt vé");
        }
    }
)
const ticketReservationSlice = createSlice({
    name: "ticketReservation",
    initialState: {
        reservation: null,
        loading: false,
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.reservation = action.payload;

            })
            .addCase(fetchTicketReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(reserveTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(reserveTicket.fulfilled, (state, action) => {
                state.loading = false;
                // Thêm vào danh sách đặt vé mới
                state.reservation = action.payload;
            })
            .addCase(reserveTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteReserveTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReserveTicket.fulfilled, (state) => {
                state.loading = false;
                state.reservation = null;
            }
            ).addCase(deleteReserveTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            ;
    },
});

export default ticketReservationSlice.reducer;

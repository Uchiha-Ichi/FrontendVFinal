import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const bookTickets = createAsyncThunk("ticket/bookTickets",
    async (TicketDTO, { rejectWithValue }) => {
        console.log("BookTickets", TicketDTO);
        try {
            const response = await axios.post(`${API_BASE_URL}tickets/confirmTicket`, TicketDTO);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const testTicket = createAsyncThunk("ticket/testTicket",
    async (testTicket, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}tickets/testTicket`, testTicket);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const ticketSilce = createSlice({
    name: "ticket",
    initialState: {
        ticket: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(bookTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bookTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload;
            })
            .addCase(bookTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = isRejected(action) ? action.payload : "Something went wrong";
            })
    }
})

export default ticketSilce.reducer;
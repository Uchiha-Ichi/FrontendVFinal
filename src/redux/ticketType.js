import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const featchTicketType = createAsyncThunk(
    "featchTicketType/fetch",
    async (_, { rejectWithValue }) => {
        try {

            const response = await axios.get(
                `${API_BASE_URL}tickets/getTicketType`,
            );
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Lỗi khi lấy thông tin đối tượng vé"
            );
        }
    }
);

const ticketTypeSlice = createSlice({
    name: "ticketType",
    initialState: {
        types: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(featchTicketType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(featchTicketType.fulfilled, (state, action) => {
                state.loading = false;
                state.types = action.payload;
            })
            .addCase(featchTicketType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default ticketTypeSlice.reducer;
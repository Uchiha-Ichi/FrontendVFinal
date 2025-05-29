import { configureStore } from "@reduxjs/toolkit";
import ticketReservationReducer from "./ticketReservationSlice"; // Import slice
import ticketReducer from "./ticketSlice";
import ticketTypeReducer from "./ticketType";
import stationAutoCompleteReducer from "./stationAutoCompleteSlice"
import stationSearchReducer from "./stationSearchSlice"
import carriageReducer from "./carriageSlice";
import seatReducer from "./seatSlice";
import checkTicketReducer from "./checkTicketSlice";
export const store = configureStore({
    reducer: {
        ticketReservation: ticketReservationReducer,
        ticket: ticketReducer,
        ticketType: ticketTypeReducer,
        stationAutoComplete: stationAutoCompleteReducer,
        stationSearch: stationSearchReducer,
        carriage: carriageReducer,
        seat: seatReducer,
        checkTicket: checkTicketReducer,
        // Add other reducers here...
    },
});


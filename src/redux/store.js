import { configureStore } from "@reduxjs/toolkit";
import ticketReservationReducer from "./ticketReservationSlice";
import ticketReducer from "./ticketSlice";
import passsenTypeReducer from "./passengerTypeSlice";
import stationAutoCompleteReducer from "./stationAutoCompleteSlice";
import stationSearchReducer from "./stationSearchSlice";
import seatReducer from "./seatSlice";
import checkTicketReducer from "./checkTicketSlice";
export const store = configureStore({
  reducer: {
    ticketReservation: ticketReservationReducer,
    ticket: ticketReducer,
    passengerType: passsenTypeReducer,
    stationAutoComplete: stationAutoCompleteReducer,
    stationSearch: stationSearchReducer,
    seat: seatReducer,
    checkTicket: checkTicketReducer,
    // Add other reducers here...
  },
});

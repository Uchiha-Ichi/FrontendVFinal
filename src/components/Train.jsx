import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSeat, markSeatAsAvailable } from "../redux/seatSlice";

import { Box, Text, Flex, VStack, HStack, Button } from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  reserveTicket,
  deleteReserveTicket,
} from "../redux/ticketReservationSlice";
import { RouteContext } from "../store/RouteContext";

// Component: Ghế
const Seat = ({ seat, isSelected, onClick }) => {
  const isDisabled = seat.isOccupied && !isSelected;
  const bgColor = isDisabled
    ? "gray.400"
    : isSelected
    ? "green.400"
    : "red.300";

  return (
    <Button
      onClick={isDisabled ? undefined : onClick}
      width="44px"
      height="44px"
      backgroundColor={bgColor}
      border="1px solid"
      borderColor="gray.600"
      borderRadius="md"
      margin="4px"
      cursor={isDisabled ? "not-allowed" : "pointer"}
      _hover={isDisabled ? {} : { opacity: 0.8 }}
      fontSize="sm"
    >
      {seat.seatNumber}
    </Button>
  );
};

// Component: Toa (Car)
const Car = ({ carId, carTypeName, seats, activeTrip }) => {
  const dispatch = useDispatch();
  const { state } = useContext(RouteContext);
  const { from, to } = state;

  const selectedSeats = useSelector((state) => state.seat.selectedSeats);

  const isSeatSelected = (id) =>
    selectedSeats.some((selected) => selected.id === id);

  const toggleSelectSeat = (seat) => {
    const reserveReqDTO = {
      seatId: seat.id,
      from,
      to,
    };

    if (isSeatSelected(seat.id)) {
      // dispatch(removeSeat(seat.id));
      dispatch(deleteReserveTicket(reserveReqDTO)).then((response) => {
        if (response.error) {
          toast.error("Lỗi khi hủy ghế đã chọn", {
            position: "bottom-right",
            autoClose: 4000,
          });
        } else {
          dispatch(markSeatAsAvailable(seat.id));
          toast.success("Hủy ghế thành công", {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      });
    } else {
      if (selectedSeats.length >= 5) {
        toast.warn("Chỉ được chọn tối đa 5 ghế.", {
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }

      dispatch(reserveTicket(reserveReqDTO)).then((response) => {
        if (response.error) {
          toast.error("Lỗi khi chọn ghế: " + response.error.message, {
            position: "bottom-right",
            autoClose: 4000,
          });
        } else {
          toast.success("Chọn ghế thành công!", {
            position: "bottom-right",
            autoClose: 2000,
          });

          setTimeout(() => {
            dispatch(deleteReserveTicket(reserveReqDTO)).then((action) => {
              if (deleteReserveTicket.rejected.match(action)) {
                toast.error(`Lỗi khi huỷ ghế ${seat.seatNumber}`, {
                  position: "bottom-right",
                  autoClose: 3000,
                });
              } else {
                toast.info(`Hết thời gian giữ ghế ${seat.seatNumber}`, {
                  position: "bottom-right",
                  autoClose: 3000,
                });
                dispatch(
                  selectSeat({
                    id: seat.id,
                    seatName: seat.seatNumber,
                    carId: carId,
                    price: seat.price,
                    tripId: seat.tripId,
                    expire: seat.expire,
                    trainName: activeTrip?.trainName,
                    departureStation: from,
                    arrivalStation: to,
                    departureTime: activeTrip?.departureTime,
                    arrivalTime: activeTrip?.arrivalTime,
                  })
                );
              }
            });
          }, 4 * 60 * 1000);
        }
      });
    }

    dispatch(
      selectSeat({
        id: seat.id,
        seatName: seat.seatNumber,
        carId: carId,
        price: seat.price,
        tripId: seat.tripId,
        expire: seat.expire,
        trainName: activeTrip?.trainName,
        departureStation: from,
        arrivalStation: to,
        departureTime: activeTrip?.departureTime,
        arrivalTime: activeTrip?.arrivalTime,
      })
    );
  };

  // Tạo hàng ghế theo cấu hình
  const seatsInRow =
    carTypeName === "Giường nằm khoang 6 điều hòa"
      ? 3
      : carTypeName === "Ngồi mềm điều hoà"
      ? 4
      : 2;

  const rows = [];
  for (let i = 0; i < seats.length; i += seatsInRow) {
    rows.push(seats.slice(i, i + seatsInRow));
  }

  return (
    <Box
      border="2px solid"
      borderColor="gray.300"
      borderRadius="md"
      p={6}
      mb={8}
      boxShadow="md"
      w="100%"
      maxW="500px"
      backgroundColor="white"
    >
      <Text fontSize="xl" fontWeight="bold" textAlign="center" mb={4}>
        Toa {carId} – {carTypeName}
      </Text>
      <VStack spacing={3}>
        {rows.map((rowSeats, idx) => (
          <HStack key={idx} spacing={2}>
            {rowSeats.map((seat) => (
              <Seat
                key={seat.id}
                seat={seat}
                isSelected={isSeatSelected(seat.id)}
                onClick={() => toggleSelectSeat(seat)}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

// Component chính: Train
export default function Train({ trainConfig, activeTrip }) {
  // console.log("Active Trip 1231231", activeTrip);
  // Nhóm ghế theo toa
  const groupedCars = trainConfig.reduce((acc, seat) => {
    const key = seat.carId;
    if (!acc[key]) {
      acc[key] = {
        carId: seat.carId,
        carTypeName: seat.carTypeName,
        seats: [],
      };
    }
    acc[key].seats.push(seat);
    return acc;
  }, {});

  const carsArray = Object.values(groupedCars);

  return (
    <Flex
      direction="column"
      align="center"
      py={6}
      px={4}
      bg="gray.50"
      minH="100vh"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Sơ đồ ghế tàu
      </Text>
      <VStack spacing={6} w="100%" align="center">
        {carsArray.map((car) => (
          <Car
            key={car.carId}
            carId={car.carId}
            carTypeName={car.carTypeName}
            seats={car.seats}
            activeTrip={activeTrip} // Truyền activeTrip xuống Car
          />
        ))}
      </VStack>
    </Flex>
  );
}

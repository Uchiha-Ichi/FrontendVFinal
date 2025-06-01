import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { selectSeat } from "../redux/seatSlice";

import { Box, Text, Flex, Button, VStack, HStack } from "@chakra-ui/react";
import { toast } from "react-toastify";
import {
  reserveTicket,
  deleteReserveTicket,
} from "../redux/ticketReservationSlice";
import { RouteContext } from "../store/RouteContext";

// Component: Ghế
const Seat = ({ seat, isSelected, onClick }) => {
  const bgColor = seat.isOccupied
    ? "gray.400"
    : isSelected
    ? "green.400"
    : "red.300";

  return (
    <Button
      onClick={seat.isOccupied ? undefined : onClick}
      width="44px"
      height="44px"
      backgroundColor={bgColor}
      border="1px solid"
      borderColor="gray.600"
      borderRadius="md"
      margin="4px"
      cursor={seat.isOccupied ? "not-allowed" : "pointer"}
      _hover={seat.isOccupied ? {} : { opacity: 0.8 }}
      fontSize="sm"
    >
      {seat.seatNumber}
    </Button>
  );
};

// Component: Toa (Car)
const Car = ({ carId, carTypeName, seats, activeTrip }) => {
  const [selectedSeats, setSelectedSeats] = useState([]); // lưu mảng id ghế đã chọn
  const dispatch = useDispatch();
  const { state } = useContext(RouteContext);
  const { from, to } = state;

  const seatsInRow =
    carTypeName === "Giường nằm khoang 6 điều hòa"
      ? 3
      : carTypeName === "Ngồi mềm điều hoà"
      ? 4
      : 2;

  const toggleSelectSeat = (seat) => {
    // seat.carId = carId;
    // seat.seatNumber = seatNumber;
    const reserveReqDTO = {
      seatId: seat.id,
      from,
      to,
    };

    if (selectedSeats.includes(seat.id)) {
      // Bỏ chọn ghế
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
      dispatch(deleteReserveTicket(reserveReqDTO)).then((response) => {
        if (response.error) {
          toast.error("Lỗi khi hủy ghế đã chọn", {
            position: "bottom-right",
            autoClose: 4000,
          });
        } else {
          toast.success("Hủy ghế thành công", {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      });
    } else {
      // Giới hạn 5 ghế
      if (selectedSeats.length >= 5) {
        toast.warn("Chỉ được chọn tối đa 5 ghế.", {
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }

      setSelectedSeats((prev) => [...prev, seat.id]);
      dispatch(reserveTicket(reserveReqDTO)).then((response) => {
        if (response.error) {
          toast.error("Lỗi khi đặt vé: " + response.error.message, {
            position: "bottom-right",
            autoClose: 4000,
          });
        } else {
          toast.success("Đặt vé thành công!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      });
    }

    // console.log("To 123123213", to);

    // Gửi thông tin ghế + trip để lưu vào store seatSlice
    dispatch(
      selectSeat({
        id: seat.id,
        seatName: seat.seatName,
        stt: seat.stt,
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

  // Tạo hàng ghế theo seatsInRow
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
                // carId={carId}
                isSelected={selectedSeats.includes(seat.id)}
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

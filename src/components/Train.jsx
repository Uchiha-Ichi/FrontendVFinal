
import React, { useState, useContext } from "react";

import { useSelector, useDispatch } from "react-redux";
import { selectSeat } from "../redux/seatSlice";

import {
  Box,
  Text,
  Flex,
  Button,
  VStack,
  HStack,
  // useToast,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import { reserveTicket, deleteReserveTicket } from "../redux/ticketReservationSlice";
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
const Car = ({ carId, carTypeName, seats }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const dispatch = useDispatch();
  // const toast = useToast();
  const { state } = useContext(RouteContext);
  const { from, to } = state;
  const seatsInRow =
    carTypeName === "Giường nằm khoang 6 điều hòa"
      ? 3
      : carTypeName === "Ngồi mềm điều hoà"
        ? 4
        : 2;

  const toggleSelectSeat = (seat, from, to) => {
    var reserveReqDTO = {
      seatId: seat.id,
      from: from,
      to: to
    }
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
      dispatch(
        deleteReserveTicket(
          reserveReqDTO
        )
      ).then((response) => {
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
      if (selectedSeats.length >= 5) {
        toast({
          title: "Giới hạn",
          description: "Chỉ được chọn tối đa 5 ghế.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      setSelectedSeats((prev) => [...prev, seat]);
      dispatch(reserveTicket(
        reserveReqDTO
      )).then((response) => {
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

    dispatch(selectSeat(seat));
  };

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
                isSelected={selectedSeats.some((s) => s.id === seat.id)}
                onClick={() => toggleSelectSeat(seat, from, to)}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

// Component chính: Train
export default function Train({ trainConfig }) {
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
          />
        ))}
      </VStack>
    </Flex>
  );
}

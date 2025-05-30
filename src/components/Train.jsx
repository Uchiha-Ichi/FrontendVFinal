import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  VStack,
  HStack,
  // useToast,
} from "@chakra-ui/react";

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

// Component: Toa
const Car = ({ carId, carTypeName, seats }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  // const toast = useToast();

  const seatsInRow =
    carTypeName === "Giường nằm khoang 6 điều hòa"
      ? 3
      : carTypeName === "Ngồi mềm điều hoà"
      ? 4
      : 2;

  const toggleSelectSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
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
      setSelectedSeats((prev) => [...prev, seatId]);
    }
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
                isSelected={selectedSeats.includes(seat.id)}
                onClick={() => toggleSelectSeat(seat.id)}
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

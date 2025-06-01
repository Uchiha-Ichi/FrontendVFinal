import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Heading,
  Box,
  Text,
  Container,
  VStack,
  Grid,
  Spinner,
  Card,
  Button,
} from "@chakra-ui/react";

import { RouteContext } from "../store/RouteContext";
import StationContext from "../store/StationContext";

import { searchTrains, setCurrentTrip } from "../redux/stationSearchSlice";
import { fetchSeat } from "../redux/seatSlice";
import { setTicketsToBook } from "../redux/ticketSlice";

import Train from "../components/Train";
import SeatCountdown from "../components/SeatCountdown/SeatCountdown";

export default function BookingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // from, to, date from RouteContext
  const { state } = useContext(RouteContext);
  const { from, to, date } = state;

  // stations from StationContext
  const { stations } = useContext(StationContext);

  const [activeTripId, setActiveTripId] = useState(null);

  const trips = useSelector((state) => state.stationSearch?.trips || []);
  const loading = useSelector((state) => state.stationSearch?.loading);
  const seatLoading = useSelector((state) => state.seat.loading);
  const error = useSelector((state) => state.stationSearch?.error);
  const seats = useSelector((state) => state.seat.seats);
  const selectedSeats = useSelector((state) => state.seat.selectedSeats);
  const totalPrice = useSelector((state) => state.seat.totalPrice);

  const activeTrip = trips.find((trip) => trip.id === activeTripId);

  const handleTransfer = () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ghế trước khi thanh toán !", {
        position: "bottom-right",
        autoClose: 4000,
      });
      return;
    }
    const ticketsToBook = selectedSeats.map((seat) => ({
      seatId: seat.id,
      price: seat.price,
      departureTime: seat.departureTime,
      arrivalTime: seat.arrivalTime,
      departureStationId: from,
      arrivalStationId: to,
      expire: seat.expire,
    }));
    dispatch(setTicketsToBook(ticketsToBook));

    navigate("/info");
  };

  const formatTotalPrice = (price) =>
    price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const getStationName = (id) => stations.find((s) => s.id === id)?.name || id;

  useEffect(() => {
    if (from && to && date) {
      if (from === to) {
        toast.error("Ga đi và ga đến không được giống nhau!", {
          position: "bottom-right",
          autoClose: 4000,
        });
        return;
      }
      dispatch(searchTrains({ from, to, date }))
        .unwrap()
        .then(() => {
          toast.success("Tải danh sách chuyến tàu thành công!", {
            position: "bottom-right",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          toast.error(`Lỗi khi tải chuyến tàu: ${err}`, {
            position: "bottom-right",
            autoClose: 4000,
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        });
    }
  }, [dispatch, from, to, date, navigate]);

  return (
    <Box py={12} px={4}>
      <ToastContainer />

      {/* Title */}
      <Box textAlign="center" mb={10}>
        <Heading size="xl" fontWeight="bold">
          {getStationName(from)} → {getStationName(to)}
        </Heading>
        <Text mt={2} color="gray.600">
          Ngày: {date}
        </Text>
      </Box>

      <Container maxW="6xl">
        {loading && (
          <Box textAlign="center" my={8}>
            <Spinner size="lg" />
            <Text mt={2}>Đang tìm kiếm chuyến tàu...</Text>
          </Box>
        )}

        {!loading && error && (
          <Text color="red.500" textAlign="center" mb={6}>
            Lỗi: {error}
          </Text>
        )}

        {!loading && trips.length === 0 && (
          <Text textAlign="center" mt={8}>
            Không có chuyến tàu nào phù hợp.
          </Text>
        )}

        {!loading && trips.length > 0 && (
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 3fr" }}
            gap={6}
            alignItems="flex-start"
          >
            <Box
              overflowX={{ base: "auto", md: "visible" }}
              whiteSpace={{ base: "nowrap", md: "normal" }}
              display="flex"
              flexDirection={{ base: "row", md: "column" }}
              gap={4}
              pb={{ base: 4, md: 0 }}
            >
              <Button
                onClick={handleTransfer}
                colorScheme="teal"
                size="lg"
                height="auto"
                display="block"
                textAlign="left"
                whiteSpace="normal"
                px={4}
                py={4}
                bg="blue.100"
                w="100%"
                borderColor="blue.600"
                color="black"
                isDisabled={selectedSeats.length === 0}
              >
                <Box>
                  {selectedSeats.length === 0 ? (
                    <Text fontWeight="bold" color="gray.500">
                      Chưa chọn vé nào
                    </Text>
                  ) : (
                    <>
                      {selectedSeats.map((seat, id) => (
                        <Box
                          key={id}
                          p={2}
                          mb={2}
                          borderWidth="1px"
                          borderRadius="md"
                          bg="blue.200"
                        >
                          <Text fontWeight="bold">
                            {seat?.trainName || "Chưa rõ tên tàu"}
                          </Text>
                          <Text>
                            {seat?.departureStation || "Ga đi chưa rõ"} -{" "}
                            {seat?.arrivalStation || "Ga đến chưa rõ"}
                          </Text>
                          <Text>
                            {seat?.departureTime
                              ? new Date(seat.departureTime).toLocaleString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "Chưa có thông tin thời gian"}
                          </Text>
                          <Text>
                            {seat?.arrivalTime
                              ? new Date(seat.arrivalTime).toLocaleString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "Chưa có thông tin thời gian"}
                          </Text>

                          <Text>
                            Toa {seat.carId} - Ghế {seat.seatName}
                          </Text>
                          <SeatCountdown expire={seat.expire} />
                        </Box>
                      ))}
                      <Text fontWeight="bold">
                        {selectedSeats.length} ghế đã chọn -{" "}
                        {formatTotalPrice(totalPrice)}
                      </Text>
                    </>
                  )}
                </Box>
              </Button>

              {trips.map((trip) => (
                <Card.Root
                  key={trip.id}
                  minW={{ base: "250px", md: "auto" }}
                  borderWidth="2px"
                  borderColor={
                    trip.id === activeTripId ? "blue.500" : "gray.200"
                  }
                  bg={trip.id === activeTripId ? "blue.50" : "white"}
                  cursor="pointer"
                  onClick={() => {
                    setActiveTripId(trip.id);
                    dispatch(setCurrentTrip(trip));
                    dispatch(
                      fetchSeat({
                        tripId: trip.id,
                        from: from,
                        to: to,
                      })
                    ).catch((err) => {
                      toast.error(`Lỗi khi tải Ghế: ${err}`, {
                        position: "bottom-right",
                        autoClose: 4000,
                      });
                    });
                  }}
                  transition="all 0.2s"
                  _hover={{ shadow: "md" }}
                >
                  <Card.Header>
                    <Box
                      bg="blue.500"
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                    >
                      <Heading size="md">
                        Tàu: {trip.trainName || "Chưa rõ"}
                      </Heading>
                    </Box>
                  </Card.Header>

                  <Card.Body>
                    <VStack align="start" spacing={2}>
                      <Text>
                        Thời gian đi:{" "}
                        {new Date(trip.departureTime).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Text>

                      <Text>
                        Thời gian đến:{" "}
                        {new Date(trip.arrivalTime).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Text>

                      <Box
                        bg="green.500"
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="md"
                      >
                        <Text>
                          Số ghế còn lại:{" "}
                          {seats.filter((seat) => !seat.isOccupied).length}
                        </Text>
                      </Box>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </Box>

            {activeTrip && (
              <>
                {seatLoading && (
                  <Box textAlign="center" my={8}>
                    <Spinner size="lg" />
                    <Text mt={2}>Đang tải dữ liệu ghế...</Text>
                  </Box>
                )}

                {!seatLoading && error && (
                  <Text color="red.500" textAlign="center" mb={6}>
                    Lỗi: {error}
                  </Text>
                )}

                {!seatLoading && seats.length === 0 && (
                  <Text textAlign="center" mt={8}>
                    Không có dữ liệu ghế phù hợp.
                  </Text>
                )}

                <Box>
                  <Train trainConfig={seats} activeTrip={activeTrip} />
                </Box>
              </>
            )}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

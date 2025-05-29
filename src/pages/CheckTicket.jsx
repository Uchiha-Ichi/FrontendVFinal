import {
  Box,
  Heading,
  Button,
  Input,
  Text,
  Flex,
  Stack,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchTicketById, searchTicketsByReservationCode } from "../redux/checkTicketSlice";

const CheckTicket = () => {
  const [checkType, setCheckType] = useState("ticketId");
  const [ticketId, setTicketId] = useState("");
  const [reservationCode, setReservationCode] = useState("");
  const [ticketList, setTicketList] = useState([]);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { tickets, loading, error: reduxError } = useSelector((state) => state.checkTicket);

  useEffect(() => {
    setTicketId("");
    setReservationCode("");
    setTicketList([]);
    setError("");
  }, [checkType]);

  useEffect(() => {
    if (tickets) {
      if (Array.isArray(tickets)) setTicketList(tickets);
      else setTicketList([tickets]);
    }
  }, [tickets]);

  useEffect(() => {
    if (reduxError) {
      setError(typeof reduxError === "string" ? reduxError : "Có lỗi xảy ra");
    }
  }, [reduxError]);

  const handleCheckTicket = () => {
    setError("");
    setTicketList([]);

    if (checkType === "ticketId") {
      if (!ticketId) {
        setError("Vui lòng nhập mã vé!");
        return;
      }
      dispatch(searchTicketById(ticketId));
    } else {
      if (!reservationCode) {
        setError("Vui lòng nhập mã đặt chỗ!");
        return;
      }
      dispatch(searchTicketsByReservationCode(reservationCode));
    }
  };

  const findDepartureTime = (trip, departureStation) => {
    if (!trip?.train?.trainSchedules || !departureStation) return null;

    const schedule = trip.train.trainSchedules.find(
      (s) => s.station?.stationId === departureStation.stationId
    );

    return schedule?.arrivalTime || null;
  };

  return (
    <Box maxW="1000px" mx="auto" my={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={5}>Kiểm tra vé</Heading>

      <Flex justify="center" gap={4} mb={6}>
        <Button
          variant={checkType === "ticketId" ? "solid" : "outline"}
          colorScheme={checkType === "ticketId" ? "blue" : "gray"}
          onClick={() => setCheckType("ticketId")}
        >
          Kiểm tra bằng mã vé
        </Button>
        <Button
          variant={checkType === "reservationCode" ? "solid" : "outline"}
          colorScheme={checkType === "reservationCode" ? "blue" : "gray"}
          onClick={() => setCheckType("reservationCode")}
        >
          Kiểm tra bằng mã đặt chỗ
        </Button>
      </Flex>

      <Stack spacing={4} mb={6}>
        {checkType === "ticketId" ? (
          <Input
            placeholder="Nhập mã vé"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
        ) : (
          <Input
            placeholder="Nhập mã đặt chỗ"
            value={reservationCode}
            onChange={(e) => setReservationCode(e.target.value)} 
          />
        )}
        <Button colorScheme="blue" onClick={handleCheckTicket} isDisabled={loading}>
          {loading ? <Spinner size="sm" mr={2} /> : null}
          {loading ? "Đang kiểm tra..." : "Kiểm tra"}
        </Button>
      </Stack>

      {error && (
        <Text color="red.500" fontSize="sm" mb={4}>
          {error}
        </Text>
      )}

      {ticketList.length > 0 && (
        <Box mt={8} bg="gray.50" p={5} borderRadius="md">
          {checkType === "reservationCode" && (
            <Heading size="lg" mb={4}>Danh sách vé</Heading>
          )}
          <SimpleGrid columns={{ base: 1, md: checkType === "ticketId" ? 1 : 2 }} spacing={6}>
            {ticketList.map((ticket, index) => {
              const res = ticket.reservation;
              const trip = ticket.trip;
              const seat = ticket.seat;
              const carriage = seat?.carriageList;
              const compartment = carriage?.compartment;

              // Lấy thông tin ga đi và ga đến từ đối tượng ticket
              const departureStation = ticket.departureStation;
              const arrivalStation = ticket.arrivalStation;

              return (
                <Box key={index} w="100%" p={4} borderWidth="1px" borderRadius="md" bg="white" shadow="sm">
                  <Stack spacing={2} textAlign="left">
                    {checkType === "reservationCode" && (
                      <Text fontSize="md" color="red.500" fontWeight="bold">
                        Vé {index + 1}
                      </Text>
                    )}
                    <Text><Text as="span" color="blue.700" fontWeight="semibold">Mã vé:</Text> {ticket.ticketId}</Text>
                    <Text><Text as="span" color="blue.700" fontWeight="semibold">Hành khách:</Text> {ticket.passenger?.fullname || "Không có dữ liệu"}</Text>
                    <Text><Text as="span" color="blue.700" fontWeight="semibold">Tên tàu:</Text> {trip?.train?.trainName || "Không có dữ liệu"}</Text>
                    <Text>
                      <Text as="span" color="blue.700" fontWeight="semibold">Giờ khởi hành:</Text>{" "}
                      {trip?.tripDate
                        ? `${new Date(trip.tripDate).toLocaleDateString("vi-VN")} - ${findDepartureTime(trip, departureStation) || "Chưa có giờ"}`
                        : "Không có dữ liệu"}
                    </Text>
                    <Text>
                      <Text as="span" color="blue.700" fontWeight="semibold">Vị trí ghế:</Text>{" "}
                      {seat?.seatNumber || "?"} - Tầng {seat?.floor || "?"} - Toa {carriage?.stt || "?"} - Khoang {compartment?.compartmentName || "?"}
                    </Text>
                    <Text><Text as="span" color="blue.700" fontWeight="semibold">Giá:</Text> {ticket.totalPrice ? `${ticket.totalPrice} VND` : "Chưa có giá"}</Text>
                    
                    <Text>
                      <Text as="span" color="blue.700" fontWeight="semibold">Điểm khởi hành: </Text>
                      ga {departureStation?.stationName || "Không có dữ liệu"}
                    </Text>
                    <Text>
                      <Text as="span" color="blue.700" fontWeight="semibold">Điểm đến: </Text>
                      ga {arrivalStation?.stationName || "Không có dữ liệu"}
                    </Text>
                    <Text>
                      <Text as="span" color="blue.700" fontWeight="semibold">Tuyến tàu:</Text> {trip?.train?.route?.routeName || "Không có dữ liệu"}
                    </Text>

                    <Text><Text as="span" color="blue.700" fontWeight="semibold">Trạng thái vé:</Text> {ticket.ticketStatus || "Không có dữ liệu"}</Text>
                  </Stack>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default CheckTicket;

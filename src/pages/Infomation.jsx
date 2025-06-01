import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedSeats, selectSeat } from "../redux/seatSlice";
import { deleteReserveTicket } from "../redux/ticketReservationSlice";
import { setTicketsToBook } from "../redux/ticketSlice"; // import action
import { fetchPassengerTypes } from "../redux/passengerTypeSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Select,
  Input,
  Button,
  Table,
  Portal,
  HStack,
  Stack,
  VStack,
  createListCollection,
} from "@chakra-ui/react";
import SeatCountdown from "../components/SeatCountdown/SeatCountdown";

export default function Infomation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ticketsToBook = useSelector(
    (state) => state.ticket.ticketsToBook || []
  );
  // const selectedSeats = useSelector((state) => state.seat.selectedSeats);
  const passengerTypes = useSelector(
    (state) => state.passengerType.types || []
  );

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    cccd: "",
    email: "",
  });

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (ticketsToBook.length > 0) {
      setTickets(
        ticketsToBook.map((ticket) => ({
          ...ticket,
          fullName: "",
          cccd: "",
          totalPrice: ticket.price || 0,
          discount: 0,
          passengerType: null,
          expire: ticket.expire,
        }))
      );
    } else {
      navigate("/");
    }
  }, [ticketsToBook, navigate]);

  useEffect(() => {
    dispatch(fetchPassengerTypes());
  }, [dispatch]);

  const handlePay = async (event) => {
    event.preventDefault();
    try {
      const ticketReqDTOList = tickets.map(({ expire, discount, price, fullName, arrivalTime, departureTime, passengerType, seatId, ...rest }) => ({
        ...rest,
        name: fullName,
        endTime: arrivalTime,
        startTime: departureTime,
        typeId: passengerType,
        seatAssignmentId: seatId
      }));
      const payload = {
        name: customerInfo.name,
        cccd: customerInfo.cccd,
        phone: customerInfo.phone,
        email: customerInfo.email,
        ticketReqDTOList: ticketReqDTOList,
      };
      console.log("payload", payload);

      const totalAmount = tickets.reduce(
        (sum, t) => sum + (t.price || 0),
        0
      );
      let requestData = {
        customer: customerInfo.name,
        amount: totalAmount,
      };

      const response = await axios.post(
        "http://localhost:5000/payment",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.resultCode === 0) {
        localStorage.setItem("payload", JSON.stringify(payload));
        window.location.href = response.data.payUrl;
      } else {
        console.error("Thanh toán thất bại:", response.data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thanh toán:", error);
    }
  };

  // const handleDeleteTicketReservation = async (index) => {
  //   if (!selectedSeats[index]) return;

  //   const seatToDelete = selectedSeats[index];
  //   const ticketToDelete = tickets[index];

  //   let ticketReservationDTO = {
  //     seat: seatToDelete.seatId,
  //     trip: seatToDelete.reservation.tripId,
  //     departureStation: seatToDelete.reservation.departureStation.stationName,
  //     arrivalStation: seatToDelete.reservation.arrivalStation.stationName,
  //   };

  //   try {
  //     const response = dispatch(deleteReserveTicket(ticketReservationDTO));
  //     if (response.error) {
  //       console.error("Lỗi khi xóa vé:", response.error);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi gọi API xóa vé:", error);
  //   }

  //   dispatch(clearSelectedSeats()); // hoặc dispatch từng seat để remove tùy cách bạn làm slice

  //   setTickets((prev) => prev.filter((_, i) => i !== index));

  //   // TODO: nếu muốn sync lại ticketsToBook trong redux sau xóa, dispatch setTicketsToBook nếu cần
  // };

  const handlePrice = (value, index) => {
    let discount = 0;
    let passengerType = 2;

    // console.log("Selected passenger type:", value.items[0].discountRate);
    if (value.value[0] === "Trẻ em") {
      discount = 0.5;
      passengerType = 1;
    } else if (value.value[0] === "Sinh viên") {
      // console.log("Selected :", value);
      discount = 0.1;
      passengerType = 3;
    } else if (value.value[0] === "Người cao tuổi") {
      discount = 0.3;
      passengerType = 4;
    }

    setTickets((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        discount,
        passengerType,
        totalPrice: updated[index].price * (1 - discount),
      };
      return updated;
    });
  };

  const collection = createListCollection({
    items: passengerTypes.map((type) => ({
      label: type.typeName,
      value: type.typeName,
      discountRate: type.discountRate,
    })),
  });

  const getTotalAmount = () => {
    return tickets.reduce((sum, t) => sum + (t.totalPrice || 0), 0);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading size="md" mb={4}>
        Danh sách vé đã chọn
      </Heading>
      <Table.Root variant="simple" size="sm">
        <Table.Header bg="gray.100">
          <Table.Row>
            <Table.Cell>Họ tên</Table.Cell>
            <Table.Cell>Thông tin chỗ</Table.Cell>
            <Table.Cell>Giá vé</Table.Cell>
            <Table.Cell>Giảm đối tượng</Table.Cell>
            <Table.Cell>Thành tiền (VNĐ)</Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tickets.map((ticket, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <VStack spacing={1} align="start">
                  <Input
                    placeholder="Họ tên"
                    size="sm"
                    value={ticket.fullName}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[index].fullName = e.target.value;
                      setTickets(newTickets);
                    }}
                  />
                  <Select.Root
                    collection={collection}
                    size="sm"
                    width="320px"
                    onValueChange={(value) => handlePrice(value, index)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Chọn đối tượng" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          <Select.ItemGroup>
                            {collection.items.map((item) => (
                              <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                              </Select.Item>
                            ))}
                          </Select.ItemGroup>
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                  <Input
                    placeholder="Số giấy tờ"
                    size="sm"
                    value={ticket.cccd}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[index].cccd = e.target.value;
                      setTickets(newTickets);
                    }}
                  />
                </VStack>
              </Table.Cell>
              <Table.Cell>
                <Text fontSize="sm">
                  {ticket.departureStation} - {ticket.arrivalStation}
                </Text>
                <Text fontSize="sm">
                  {new Date(ticket.departureTime).toLocaleDateString("vi-VN")}
                </Text>
                <Text fontSize="sm">
                  Toa {ticket.stt || ""} - Ghế {ticket.seatId || ""}
                </Text>
                {/* <SeatCountdown expire={ticket.expire} /> */}
              </Table.Cell>
              <Table.Cell>
                {(ticket.price || 0).toLocaleString()} VND
              </Table.Cell>
              <Table.Cell>{(ticket.discount * 100).toFixed(0)}%</Table.Cell>
              <Table.Cell>
                {(ticket.totalPrice || 0).toLocaleString()} VND
              </Table.Cell>
              <Table.Cell>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteTicketReservation(index)}
                >
                  Xóa
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Flex justify="flex-end" my={4} align="center" gap={2}>
        <Button
          size="sm"
          colorScheme="gray"
          onClick={() => {
            dispatch(clearSelectedSeats());
            navigate("/");
          }}
        >
          Xóa tất cả các vé
        </Button>
      </Flex>

      <Flex justify="flex-end" mb={6}>
        <Text fontWeight="bold">Tổng tiền:&nbsp;</Text>
        <Text fontWeight="bold" color="blue.600">
          {getTotalAmount().toLocaleString() || "0"} VND
        </Text>
      </Flex>

      <Box borderTop="1px" borderColor="gray.300" pt={4}>
        <Heading size="sm" mb={2} color="orange.500">
          Thông tin người đặt vé
        </Heading>
        <Text fontSize="sm" mb={4}>
          Quý khách vui lòng điền đầy đủ và chính xác các thông tin về người mua
          vé dưới đây...
        </Text>
        <Flex flexWrap="wrap" gap={4}>
          <Input
            placeholder="Họ và tên*"
            width="300px"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            placeholder="Số CMND/Hộ chiếu*"
            width="300px"
            value={customerInfo.cccd}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, cccd: e.target.value }))
            }
          />
          <Input
            placeholder="Email để nhận vé điện tử*"
            width="300px"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            placeholder="Số di động*"
            width="300px"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </Flex>
        <Flex justify="flex-end" my={4} align="center" gap={2}>
          <Button size="sm" colorScheme="gray" onClick={handlePay}>
            Thanh Toán
          </Button>
        </Flex>
        <Flex justify="space-between" align="center" mb={4}>
          <Button size="sm" colorScheme="blue" as={Link} to="/booking">
            ← Quay lại chọn vé
          </Button>
          <Heading
            size="md"
            color="red.400"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            Hủy đặt vé
          </Heading>
        </Flex>
      </Box>
    </Box>
  );
}

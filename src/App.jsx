import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  IconButton,
  VStack,
  useDisclosure,
  Drawer,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import { FaBars, FaHome, FaUtensils } from "react-icons/fa";
import "./App.css";
import Booking from "./pages/Booking";
import CheckTicket from "./pages/CheckTicket";
import Home from "./pages/Home";
import Infomation from "./pages/Infomation";
import TrainSchedule from "./pages/TrainSchedule";
import PaymentSuccess from "./pages/PaymentSuccess";
import { RouteProvider } from "./store/RouteContext";
import { clearSelectedSeats } from "./redux/seatSlice";
import { deleteReserveTicket } from "./redux/ticketReservationSlice";
function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const selectedSeats = useSelector((state) => state.seat.selectedSeats);
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;

  const handleDeleteTicketReservation = async () => {
    for (let i = 0; i < selectedSeats.length; i++) {

      let ticketReservationDTO = {
        seat: selectedSeats[i].seatId,
        trip: selectedSeats[i].reservation.trip.tripId,
        departureStation: selectedSeats[i].reservation.departureStation.stationName,
        arrivalStation: selectedSeats[i].reservation.arrivalStation.stationName
      };
      await dispatch(deleteReserveTicket(ticketReservationDTO))
    }
    dispatch(clearSelectedSeats());
  }
  return (
    <Container maxW="container.xl" p={4}>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg="white"
        px={6}
        py={4}
        zIndex="50"
      >
        <Flex
          align="center"
          justify="space-between"
          maxW="container.lg"
          mx="auto"
        >
          {/* Logo */}
          <Heading
            as={Link}
            to="/"
            onClick={handleDeleteTicketReservation}

            size="lg"
            fontWeight={900}
            _hover={{ opacity: 0.8 }}
          >
            DSVN.
          </Heading>

          {/* Desktop Navigation */}
          <Flex display={{ base: "none", md: "flex" }} gap={6}>
            <>
              <Button
                as={Link}
                to="/"
                onClick={handleDeleteTicketReservation}
                variant="ghost"
                _hover={{ textDecoration: "underline" }}
                _after={{
                  content: '""',
                  display: "block",
                  height: "2px",
                  bg: "black",
                  width: isActive("/") ? "100%" : "0",
                  transition: "width 0.3s",
                }}
              >
                Home
              </Button>
              <Button
                as={Link}
                to="/check-ticket"
                variant="ghost"
                _hover={{ textDecoration: "underline" }}
                _after={{
                  content: '""',
                  display: "block",
                  height: "2px",
                  bg: "black",
                  width: isActive("/check-ticket") ? "100%" : "0",
                  transition: "width 0.3s",
                }}
              >
                Check tickets
              </Button>
            </>
          </Flex>

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<FaBars />}
            variant="outline"
            onClick={setOpen}
          />
        </Flex>
      </Box>
      {/* Mobile Drawer Navigation */}
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Body pt={10}>
                <VStack spacing={4}>
                  <Button
                    as={Link}
                    to="/"
                    leftIcon={<FaHome />}
                    w="full"
                    justifyContent="flex-start"
                    variant="ghost"
                    _hover={{ textDecoration: "underline" }}
                    _after={{
                      content: '""',
                      display: "block",
                      height: "2px",
                      bg: "black",
                      width: isActive("/") ? "100%" : "0",
                      transition: "width 0.3s",
                    }}
                    onClick={setOpen}
                  >
                    Home
                  </Button>
                  <Button
                    as={Link}
                    to="/check-ticket"
                    leftIcon={<FaUtensils />}
                    w="full"
                    justifyContent="flex-start"
                    variant="ghost"
                    _hover={{ textDecoration: "underline" }}
                    _after={{
                      content: '""',
                      display: "block",
                      height: "2px",
                      bg: "black",
                      width: isActive("/check-ticket") ? "100%" : "0",
                      transition: "width 0.3s",
                    }}
                    onClick={setOpen}
                  >
                    Check tickets
                  </Button>
                </VStack>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      {/* Routes */}
      <Box py={4}>
        <RouteProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check-ticket" element={<CheckTicket />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/info" element={<Infomation />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/train-schedule" element={<TrainSchedule/>}/>
            {/* Redirect unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </RouteProvider>
      </Box>
      <Box as="footer" py={4} mt={10} textAlign="center">
        <Text fontSize="sm">© 2025 My App. All rights reserved.</Text>
      </Box>
    </Container>
  );
}

export default App;

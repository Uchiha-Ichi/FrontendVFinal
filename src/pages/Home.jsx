// src/pages/Home.jsx
import React, { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Flex, Container, Button, Stack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RouteContext } from "../store/RouteContext";
import StationContext from "../store/StationContext";

import Calendar from "../components/Calendar/Calendar";
import DatePicker from "../components/DatePicker/DatePicker";
import Autocomplete from "../utils/Autocomplete";
import { featchTicketType } from "../redux/ticketType";

const SearchForm = ({
  state,
  handleFromChange,
  handleToChange,
  stations,
  onSearch,
}) => {
  const [fromError, setFromError] = React.useState("");
  const [toError, setToError] = React.useState("");

  const handleSearch = () => {
    setFromError("");
    setToError("");

    if (!state.from) setFromError("Vui lòng chọn Ga đi hợp lệ");
    if (!state.to) setToError("Vui lòng chọn Ga đến hợp lệ");

    if (state.from && state.to && state.from === state.to) {
      setFromError("Ga đi và Ga đến không được trùng nhau");
      setToError("Ga đi và Ga đến không được trùng nhau");
      return;
    }

    if (!state.from || !state.to || state.from === state.to) return;

    onSearch();
  };

  return (
    <Stack gap="4" align="flex-start">
      <div>
        <Autocomplete
          label="Ga đi"
          value={stations.find((s) => s.id === state.from) || null}
          onChange={(station) => handleFromChange(station?.id)}
          options={stations}
        />
        {fromError && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            {fromError}
          </div>
        )}
      </div>
      <div>
        <Autocomplete
          label="Ga đến"
          value={stations.find((s) => s.id === state.to) || null}
          onChange={(station) => handleToChange(station?.id)}
          options={stations}
        />
        {toError && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            {toError}
          </div>
        )}
      </div>
      <Button onClick={handleSearch}>Tìm kiếm</Button>
    </Stack>
  );
};

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state, handleSetFrom, handleSetTo, handleSetDate } =
    useContext(RouteContext);
  const { stations, loading } = useContext(StationContext);

  const handleFromChange = (id) => handleSetFrom(id);
  const handleToChange = (id) => handleSetTo(id);
  const handleDateChange = (date) => handleSetDate(date);
  const handleSearch = () => navigate("/booking");

  useEffect(() => {
    dispatch(featchTicketType());
  }, [dispatch]);

  if (loading) return <Container>Đang tải danh sách ga...</Container>;

  return (
    <Container maxW="container.xl" p={16}>
      <ToastContainer />
      <Flex display={{ base: "none", md: "flex" }} gap="16" justify="center">
        <Calendar onDateChange={handleDateChange} />
        <SearchForm
          state={state}
          handleFromChange={handleFromChange}
          handleToChange={handleToChange}
          stations={stations}
          onSearch={handleSearch}
        />
      </Flex>
      <Flex display={{ base: "flex", md: "none" }} direction="column">
        <DatePicker onChange={handleDateChange} />
        <SearchForm
          state={state}
          handleFromChange={handleFromChange}
          handleToChange={handleToChange}
          stations={stations}
          onSearch={handleSearch}
        />
      </Flex>
    </Container>
  );
}

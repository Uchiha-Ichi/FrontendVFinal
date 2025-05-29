import React, { useEffect, useState, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { Flex, Container, Button, Stack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";

import { RouteContext } from "../store/RouteContext";
import Calendar from "../components/Calendar/Calendar";
import DatePicker from "../components/DatePicker/DatePicker";
import Autocomplete from "../utils/Autocomplete";
import { featchTicketType } from "../redux/ticketType";

import { useNavigate } from "react-router-dom";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SearchForm = ({ state, handleFromChange, handleToChange, stations, onSearch }) => {
  const [fromError, setFromError] = useState("");
  const [toError, setToError] = useState("");

  const handleSearch = () => {
    // Xóa lỗi cũ
    setFromError("");
    setToError("");

    // Validate stations
    const isFromValid = stations.some(
      (station) => station.stationName.toLowerCase() === state.from.toLowerCase()
    );
    const isToValid = stations.some(
      (station) => station.stationName.toLowerCase() === state.to.toLowerCase()
    );

    let hasError = false;

    if (!state.from || !isFromValid) {
      setFromError("Vui lòng chọn Ga đi hợp lệ");
      hasError = true;
    }

    if (!state.to || !isToValid) {
      setToError("Vui lòng chọn Ga đến hợp lệ");
      hasError = true;
    }

    if (state.from && state.to && state.from.toLowerCase() === state.to.toLowerCase()) {
      setFromError("Ga đi và Ga đến không được trùng nhau");
      setToError("Ga đi và Ga đến không được trùng nhau");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Nếu tất cả validate hợp lệ, gọi onSearch để chuyển hướng
    onSearch();
  };

  return (
    <Stack gap="4" align="flex-start">
      <div>
        <Autocomplete
          label="Ga đi"
          value={state.from}
          onChange={handleFromChange}
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
          value={state.to}
          onChange={handleToChange}
          options={stations}
        />
        {toError && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
            {toError}
          </div>
        )}
      </div>
      <Button
        onClick={handleSearch}
        _hover={{ textDecoration: "underline" }}
        _after={{
          content: '""',
          display: "block",
          height: "2px",
          bg: "black",
          transition: "width 0.3s",
        }}
      >
        Tìm kiếm
      </Button>
    </Stack>
  );
};

// Home component
export default function Home() {
  const dispatch = useDispatch();
  // Trong Home component
  const navigate = useNavigate();
  // Sử dụng useContext để lấy state và các hàm set
  // từ RouteContext    


  const { state, handleSetFrom, handleSetTo, handleSetDate } =
    useContext(RouteContext);

  const [stations, setStations] = useState([]);

  const handleFromChange = (e) => handleSetFrom(e.target.value);
  const handleToChange = (e) => handleSetTo(e.target.value);
  const handleDateChange = (date) => handleSetDate(date);

    const handleSearch = () => {
      // window.location.href = "/booking"; // Hoặc dùng navigate nếu dùng react-router
      navigate("/booking");
    };

  useEffect(() => {
    const fetchStations = async () => {
      try { 
        const response = await fetch(`${API_BASE_URL}station/all`);
        if (!response.ok) {
          console.error("Failed to fetch stations");
          return;
        }

        const data = await response.json();
        const stationData = data.map((station) => ({
          stationId: station.stationId,
          stationName: station.stationName,
        }));
        setStations(stationData);
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    dispatch(featchTicketType());

    fetchStations();
  }, [dispatch]);

  return (
    <Container maxW="container.xl" p={16}>
      <ToastContainer />

      {/* Desktop view */}
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

      {/* Mobile view */}
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





// import React, { useEffect, useState, useContext } from "react";
// import { ToastContainer, toast } from "react-toastify";
// // import { Link } from "react-router-dom";
// import { Flex, Container, Button, Stack } from "@chakra-ui/react";
// import { useDispatch } from "react-redux";

// import { RouteContext } from "../store/RouteContext";
// import Calendar from "../components/Calendar/Calendar";
// import DatePicker from "../components/DatePicker/DatePicker";
// import StationAutocomplete from "../utils/StationAutoComplete";
// import { featchTicketType } from "../redux/ticketType";


// class Station {
//   constructor(stationId, stationName, location) {
//     this.stationId = stationId;
//     this.stationName = stationName;
//     this.location = location;
//   }

//   getStationName(){
//     return this.stationName;
//   }

//   getStationInfo() {
//     return `${this.stationName} (ID: ${this.stationId})`;
//   }
// }

// const SearchForm = ({ state, handleFromChange, handleToChange, stations, onSearch }) => {
//   const handleSearch = () => {
//     // Validate stations trước khi chuyển hướng
//     const isFromValid = stations.some(
//       (station) => station.stationName.toLowerCase() === state.from.toLowerCase()
//     );
//     const isToValid = stations.some(
//       (station) => station.stationName.toLowerCase() === state.to.toLowerCase()
//     );

//     if (!state.from === null) {
//       setError("Vui lòng chọn Ga đi");
//       return;
//     }

//     if (!state.from || !isFromValid) {
//       setError("Vui lòng chọn Ga đi hợp lệ từ danh sách");
//       return;
//     }

//     if (!state.to || !isToValid) {
//       toast.error("Vui lòng chọn Ga đến hợp lệ từ danh sách", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       return;
//     }

//     if (state.from.toLowerCase() === state.to.toLowerCase()) {
//       toast.error("Ga đi và Ga đến không được trùng nhau", {
//         position: "bottom-right",
//         autoClose: 4000,
//       });
//       return;
//     }

//     // Nếu tất cả validate đều hợp lệ, gọi onSearch để chuyển hướng
//     onSearch();
//   };

//   return (
//     <Stack gap="4" align="flex-start">
//       <StationAutocomplete
//         label="Ga đi"
//         value={state.from}
//         onChange={handleFromChange}
//         options={stations}
//       />
//       <StationAutocomplete
//         label="Ga đến"
//         value={state.to}
//         onChange={handleToChange}
//         options={stations}
//       />
//       <Button
//         onClick={handleSearch} // Gọi handleSearch thay vì chuyển hướng trực tiếp
//         _hover={{ textDecoration: "underline" }}
//         _after={{
//           content: '""',
//           display: "block",
//           height: "2px",
//           bg: "black",
//           transition: "width 0.3s",
//         }}
//       >
//         Tìm kiếm
//       </Button>
//     </Stack>
//   );
// };

// // Home component
// export default function Home() {
//   const dispatch = useDispatch();

//   const { state, handleSetFrom, handleSetTo, handleSetDate } =
//     useContext(RouteContext);

//   const [stations, setStations] = useState([]);

//   const handleFromChange = (e) => handleSetFrom(e.target.value);
//   const handleToChange = (e) => handleSetTo(e.target.value);
//   const handleDateChange = (date) => handleSetDate(date);

//   const handleSearch = () => {
//     // Chuyển hướng đến /booking
//     window.location.href = "/booking"; // Hoặc dùng navigate nếu dùng react-router
//   };

//   useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/station/all");
//         if (!response.ok) {
//           toast.error("Can't fetch all the stations", {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//           return;
//         }

//         const data = await response.json();
//         const stationData = data.map((station) => ({
//           stationId: station.stationId,
//           stationName: station.stationName,
//           location: station.location,
//         }));
        
        
//         setStations(stationData);
//       } catch (error) {
//         console.error("Fetch failed:", error);
//         toast.error("Error fetching stations", {
//           position: "bottom-right",
//           autoClose: 4000,
//         });
//       }
//     };
//     dispatch(featchTicketType());

//     fetchStations();
//   }, [dispatch]);

//   return (
//     <Container maxW="container.xl" p={16}>
//       <ToastContainer />

//       {/* Desktop view */}
//       <Flex display={{ base: "none", md: "flex" }} gap="16" justify="center">
//         <Calendar onDateChange={handleDateChange} />
//         <SearchForm
//           state={state}
//           handleFromChange={handleFromChange}
//           handleToChange={handleToChange}
//           stations={stations}
//           onSearch={handleSearch}
//         />
//       </Flex>

//       {/* Mobile view */}
//       <Flex display={{ base: "flex", md: "none" }} direction="column">
//         <DatePicker onChange={handleDateChange} />
//         <SearchForm
//           state={state}
//           handleFromChange={handleFromChange}
//           handleToChange={handleToChange}
//           stations={stations}
//           onSearch={handleSearch}
//         />
//       </Flex>
//     </Container>
//   );
// }


















// import React, { useEffect, useState, useContext } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { Flex, Container, Button, Stack } from "@chakra-ui/react";
// import { useDispatch } from "react-redux";

// import { RouteContext } from "../store/RouteContext";
// import Calendar from "../components/Calendar/Calendar";
// import DatePicker from "../components/DatePicker/DatePicker";
// import Input from "../components/Input/Input";
// import StationAutocomplete from "../utils/StationAutoComplete";
// import { featchTicketType } from "../redux/ticketType";

// const SearchForm = ({ state, handleFromChange, handleToChange, stations }) => (
//   <Stack gap="4" align="flex-start">
//     <StationAutocomplete
//       label="Ga đi"
//       value={state.from}
//       onChange={handleFromChange}
//       options={stations}
//     />
//     <StationAutocomplete
//       label="Ga đến"
//       value={state.to}
//       onChange={handleToChange}
//       options={stations}
//     />
//     <Button
//       as={Link}
//       to="/booking"
//       // variant="ghost"
//       _hover={{ textDecoration: "underline" }}
//       _after={{
//         content: '""',
//         display: "block",
//         height: "2px",
//         bg: "black",
//         transition: "width 0.3s",
//       }}
//     >
//       Tìm kiếm
//     </Button>
//   </Stack>
// );

// // Home component
// export default function Home() {
//   const dispatch = useDispatch();

//   const { state, handleSetFrom, handleSetTo, handleSetDate } =
//     useContext(RouteContext);

//   const [stations, setStations] = useState([]);

//   const handleFromChange = (e) => handleSetFrom(e.target.value);
//   const handleToChange = (e) => handleSetTo(e.target.value);
//   const handleDateChange = (date) => handleSetDate(date);

//   useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/station/all");
//         if (!response.ok) {
//           toast.error("Can't fetch all the stations", {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//           return;
//         }

//         const data = await response.json();
//         const stationData = data.map((station) => ({
//           stationId: station.stationId,
//           stationName: station.stationName,
//         }));
//         setStations(stationData);

//         // toast.success("Fetched all stations", {
//         //   position: "bottom-right",
//         //   autoClose: 4000,
//         // });
//       } catch (error) {
//         console.error("Fetch failed:", error);
//         toast.error("Error fetching stations", {
//           position: "bottom-right",
//           autoClose: 4000,
//         });
//       }
//     };
//     dispatch(featchTicketType());

//     fetchStations();
//   }, [dispatch]);

//   return (
//     <Container maxW="container.xl" p={16}>
//       <ToastContainer />

//       {/* Desktop view */}
//       <Flex display={{ base: "none", md: "flex" }} gap="16" justify="center">
//         <Calendar onDateChange={handleDateChange} />
//         <SearchForm
//           state={state}
//           handleFromChange={handleFromChange}
//           handleToChange={handleToChange}
//           stations={stations}
//         />
//       </Flex>

//       {/* Mobile view */}
//       <Flex display={{ base: "flex", md: "none" }} direction="column">
//         <DatePicker onChange={handleDateChange} />
//         <SearchForm
//           state={state}
//           handleFromChange={handleFromChange}
//           handleToChange={handleToChange}
//           stations={stations}
//         />
//       </Flex>
//     </Container>
//   );
// }


// import React, { useEffect, useState, useContext } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import { Flex, Container, Button, Stack } from "@chakra-ui/react";
// import { useDispatch } from "react-redux";

// import { RouteContext } from "../store/RouteContext";
// import Calendar from "../components/Calendar/Calendar";
// import DatePicker from "../components/DatePicker/DatePicker";
// import Input from "../components/Input/Input";
// import StationAutocomplete from "../utils/StationAutoComplete";
// import { featchTicketType } from "../redux/ticketType";

// class Station {
//   constructor(stationId, stationName) {
//     this.stationId = stationId;
//     this.stationName = stationName;
//   }
  
//   // Bạn có thể thêm các phương thức cho class nếu cần
//   getStationname(){
//     return this.getStationname;
//   }

//   getStationInfo() {
//     return `${this.stationName} (ID: ${this.stationId})`;
//   }
// }
// const SearchForm = ({ state, handleFromChange, handleToChange, stations }) => (
//   <Stack gap="4" align="flex-start">
//     <StationAutocomplete
//       label="Ga đi"
//       value={state.from}
//       onChange={handleFromChange}
//       options={stations}
//     />
//     <StationAutocomplete
//       label="Ga đến"
//       value={state.to}
//       onChange={handleToChange}
//       options={stations}
//     />
//     <Button
//       as={Link}
//       to="/booking"
//       // variant="ghost"
//       _hover={{ textDecoration: "underline" }}
//       _after={{
//         content: '""',
//         display: "block",
//         height: "2px",
//         bg: "black",
//         transition: "width 0.3s",
//       }}
//     >
//       Tìm kiếm
//     </Button>
//   </Stack>
// );

// // Home component
// export default function Home() {
//   const dispatch = useDispatch();

//   const { state, handleSetFrom, handleSetTo, handleSetDate } =
//     useContext(RouteContext);

//   const [stations, setStations] = useState([Station]);

//   const handleFromChange = (e) => handleSetFrom(e.target.value);
//   const handleToChange = (e) => handleSetTo(e.target.value);
//   const handleDateChange = (date) => handleSetDate(date);

//   useEffect(() => {
//     const fetchStations = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/station/all");
//         if (!response.ok) {
//           toast.error("Can't fetch all the stations", {
//             position: "bottom-right",
//             autoClose: 4000,
//           });
//           return;
//         }

//         const data = await response.json();
//         const stationData = data.map((station) => ({
//           stationId: station.stationId,
//           stationName: station.stationName,
//         }));
//         setStations(stationData);

//         // toast.success("Fetched all stations", {
//         //   position: "bottom-right",
//         //   autoClose: 4000,
//         // });
//       } catch (error) {
//         console.error("Fetch failed:", error);
//         toast.error("Error fetching stations", {
//           position: "bottom-right",
//           autoClose: 4000,
//         });
//       }
//     };
//     dispatch(featchTicketType());

//     fetchStations();
//   }, [dispatch]);

//   const validateStation = async (_, value) => {
//     if (!value || stations.some((station) => station.s === value)) {
//       return Promise.resolve();
//     }
//     return Promise.reject(new Error('Vui lòng chọn tuyến hợp lệ từ danh sách!'));
//   };
//   return (
//     <Container maxW="container.xl" p={16}>
//       <ToastContainer />

//       {/* Desktop view */}
//       <Flex display={{ base: "none", md: "flex" }} gap="16" justify="center">
//         <Calendar onDateChange={handleDateChange} />
//         <SearchForm
//           state={state}
//           handleFromChange={handleFromChange}
//           handleToChange={handleToChange}
//           stations={stations}
//         />
//       </Flex>

//       {/* Mobile view */}
//       <Flex display={{ base: "flex", md: "none" }} direction="column">
//         <DatePicker onChange={handleDateChange} />
//         <SearchForm
//           state={state}
//           handleFromChange={handleFromChange}
//           handleToChange={handleToChange}
//           stations={stations}
//         />
//       </Flex>
//     </Container>
//   );
// }
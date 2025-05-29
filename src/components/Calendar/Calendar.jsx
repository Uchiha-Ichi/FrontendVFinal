// import moment from "moment";
// import styles from "./Calendar.module.scss";
// import "rc-calendar/assets/index.css";
// import RcCalendar from "rc-calendar";
// import { useState } from "react";
// export default function Calendar({ onDateChange }) {
//   const [selectedDate, setSelectedDate] = useState(moment());

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     const formattedDate = date.format("YYYY-MM-DD");
//     // console.log("Selected date:", formattedDate);
//     onDateChange(formattedDate);
//   };

//   return (
//     <div className={styles.calendar}>
//       <h2>Ngày khởi hành: {selectedDate.format("DD-MM-YYYY")}</h2>
//       <RcCalendar onChange={handleDateChange} className={styles.rcCalendar} />
//     </div>
//   );
// }


import moment from "moment";
import styles from "./Calendar.module.scss";
import "rc-calendar/assets/index.css";
import RcCalendar from "rc-calendar";
import { useState } from "react";

export default function Calendar({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date.format("YYYY-MM-DD");
    onDateChange(formattedDate);
  };

  // Hàm kiểm tra và vô hiệu hóa các ngày trong quá khứ
  const disabledDate = (current) => {
    if (!current) {
      return false; // Nếu không có ngày, không vô hiệu hóa
    }
    const today = moment().startOf("day"); // Lấy ngày hiện tại (bỏ giờ/phút/giây)
    return current.isBefore(today); // Vô hiệu hóa nếu ngày nhỏ hơn hôm nay
  };

  return (
    <div className={styles.calendar}>
      <h2>Ngày khởi hành: {selectedDate.format("DD-MM-YYYY")}</h2>
      <RcCalendar
        onChange={handleDateChange}
        className={styles.rcCalendar}
        disabledDate={disabledDate} // Thêm thuộc tính disabledDate
      />
    </div>
  );
}
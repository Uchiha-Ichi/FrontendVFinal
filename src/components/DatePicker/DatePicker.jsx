import React, { useState } from "react";
import moment from "moment";
import styles from "./DatePicker.module.scss";

export default function DatePicker({ value, onChange }) {
  const handleDateChange = (event) => {
    const date = event.target.value;
    onChange(moment(date).format("YYYY-MM-DD"));
  };

  return (
    <div>
      <label htmlFor="date"></label>
      <input
        type="date"
        id="date"
        value={moment(value).format("YYYY-MM-DD")}
        onChange={handleDateChange}
        min={moment().format("YYYY-MM-DD")}
      />
      {/* <p>Selected Date: {moment(value).format("MMMM Do YYYY")}</p> */}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

const SeatCountdown = ({ expire }) => {
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        // 🟡 Tính lại khi expire thay đổi
        const calculateTimeLeft = () =>
            Math.max(Math.floor((expire - Date.now()) / 1000), 0);

        setSecondsLeft(calculateTimeLeft());

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [expire]); // 🟢 Giờ mỗi khi expire đổi => reset countdown

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <Text fontSize="sm" color={secondsLeft <= 10 ? "red.500" : "gray.700"}>
            {formatTime(secondsLeft)}
        </Text>
    );
};

export default SeatCountdown;

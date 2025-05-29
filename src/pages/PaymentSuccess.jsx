import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { bookTickets } from "../redux/ticketSlice";

const PaymentSuccess = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const checkPaymentStatus = async () => {
            const payload = JSON.parse(localStorage.getItem("payload")); // Lấy lại payload đã lưu trước đó
            if (!payload) return;

            // 🟢 Xác nhận rằng thanh toán thành công trước khi dispatch bookTickets
            const paymentStatus = new URLSearchParams(window.location.search).get("resultCode");

            if (paymentStatus === "0") { // MoMo trả về resultCode = 0 là thành công
                console.log("Thanh toán thành công, tiến hành đặt vé");
                dispatch(bookTickets(payload)); // Gửi yêu cầu đặt vé
            } else {
                console.log("Thanh toán thất bại hoặc bị hủy");
            }

            // Xóa payload sau khi xử lý
            localStorage.removeItem("payload");
        };

        checkPaymentStatus();
        // navigate("/");
    }, []);


    return (
        <div>
            <h2>{searchParams.get("resultCode") === "0" ? "Thanh toán thành công!" : "Thanh toán thất bại!"}</h2>
            <p>Đang chuyển hướng...</p>
        </div>
    );
};

export default PaymentSuccess;

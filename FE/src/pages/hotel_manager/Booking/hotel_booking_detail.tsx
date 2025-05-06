import React, { useEffect, useState } from "react";
import { Descriptions, Button, Card } from "antd";
import type { DescriptionsProps } from "antd";

import axios from "axios";
import { useNavigate } from "react-router-dom";
interface Payment {
  amount: number;
  original_amount: number;
  credit_card: string;
  deposit_type: string;
  discount: number;
}

interface Room {
  room_no: number;
  meal: string;
  parking_spaces: number;
  adults: number;
  children: number;
  babies: number;
}

interface RoomType {
  [roomType: string]: Room[]; // Allows dynamic room type keys
}

interface PaymentMethod {
  name: string;
}

interface Status {
  reservation_status: string;
  reservation_status_date: string;
  special_request: number;
  days_in_waiting_list: number;
}

interface BookingDetailData {
  field_id: string;
  payment: Payment;
  guest_id: string;
  is_repeated_guest: boolean;
  distribution_channel: string;
  hotel_id: string;
  status: Status;
  booking_date: string;
  check_in: string;
  check_out: string;
  payment_method: PaymentMethod;
  stays_day: number;
  rating: number | null;
  price: number;
  room_type: RoomType;
}

interface ApiResponse {
  success: string;
  data: BookingDetailData;
}

// const items: DescriptionsProps["items"] = [
//   {
//     label: "ID",
//     children: "booking-1",
//   },
//   {
//     label: "Check-in",
//     children: "01/01/2017",
//   },
//   {
//     label: "Check-out",
//     children: "02/01/2017",
//   },
//   {
//     label: "Room Selected",
//     children: "2",
//   },
//   {
//     label: "Repeated Guest",
//     children: "No",
//   },
//   {
//     label: "Distribution Channel",
//     children: "Direct",
//   },
//   {
//     label: "Payment",
//     span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
//     children: (
//       <>
//         Method: Internet Banking
//         <br />
//         Original Amount: 500.000 VND
//         <br />
//         Amount: 500.000 VND
//         <br />
//         Deposit Type: No
//         <br />
//         Discount: 0%
//         <br />
//         Credit Card: 8967
//       </>
//     ),
//   },
//   {
//     label: "Status",
//     span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
//     children: (
//       <>
//         Reservation Status: Checkout
//         <br />
//         Reservation Status Date: 27/12/2017
//         <br />
//         Special Request: 2
//         <br />
//         Days in waiting list: 0
//         <br />
//       </>
//     ),
//   },
//   {
//     label: "Room",
//     children: (
//       <>
//         <Card title="Room A" type="inner">
//           <Descriptions
//             bordered
//             column={{ sm: 1, xs: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
//           >
//             <Descriptions.Item label="Meal">BB</Descriptions.Item>
//             <Descriptions.Item label="Adults">1</Descriptions.Item>
//             <Descriptions.Item label="Children">1</Descriptions.Item>
//             <Descriptions.Item label="Babies">0</Descriptions.Item>
//             <Descriptions.Item label="Car Parking">2</Descriptions.Item>
//             <Descriptions.Item label="Room No">1, 2</Descriptions.Item>
//           </Descriptions>
//           </Card>
//           <Card style={{ marginTop: 16 }} type="inner" title="Room B">
//             <Descriptions
//               bordered
//               column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
//             >
//               <Descriptions.Item label="Meal">BB</Descriptions.Item>
//               <Descriptions.Item label="Adults">1</Descriptions.Item>
//               <Descriptions.Item label="Children">1</Descriptions.Item>
//               <Descriptions.Item label="Babies">0</Descriptions.Item>
//               <Descriptions.Item label="Car Parking">2</Descriptions.Item>
//               <Descriptions.Item label="Room No">2</Descriptions.Item>
//             </Descriptions>
//           </Card>

//       </>
//     ),
//   },
// ];

// const BookingDetail: React.FC = () => {
//   const navigate = useNavigate()
//   const path = window.location.pathname;
//   const Id = path.split("/").pop();

//   const [bookingDetailData, setBookingDetailData] =
//     useState<BookingDetailData | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await axios(
//         `http://localhost:8000/api/booking/detail/?booking_id=${Id}`
//       );
//       const result: ApiResponse = response.data;
//       console.log(result);
//       setBookingDetailData(result.data);
//     };

//     fetchData();
//   }, [Id]);

//   if (!bookingDetailData) return <p>Loading...</p>;

//   const items: DescriptionsProps["items"] = [
//     {
//       label: "ID",
//       children: bookingDetailData.field_id,
//     },
//     {
//       label: "Check-in",
//       children: bookingDetailData.check_in,
//     },
//     {
//       label: "Check-out",
//       children: bookingDetailData.check_out,
//     },
//     {
//       label: "Room Selected",
//       children: Object.keys(bookingDetailData.room_type).length.toString(),
//     },
//     {
//       label: "Repeated Guest",
//       children: bookingDetailData.is_repeated_guest ? "Yes" : "No",
//     },
//     {
//       label: "Distribution Channel",
//       children: bookingDetailData.distribution_channel,
//     },
//     {
//       label: "Payment",
//       span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
//       children: (
//         <>
//           Method: {bookingDetailData.payment_method.name}
//           <br />
//           Original Amount: {bookingDetailData.payment.original_amount} VND
//           <br />
//           Amount: {bookingDetailData.payment.amount} VND
//           <br />
//           Deposit Type: {bookingDetailData.payment.deposit_type}
//           <br />
//           Discount: {bookingDetailData.payment.discount * 100}%
//           <br />
//           Credit Card: {bookingDetailData.payment.credit_card}
//         </>
//       ),
//     },
//     {
//       label: "Status",
//       span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
//       children: (
//         <>
//           Reservation Status: {bookingDetailData.status.reservation_status}
//           <br />
//           Reservation Status Date:{" "}
//           {bookingDetailData.status.reservation_status_date}
//           <br />
//           Special Request: {bookingDetailData.status.special_request}
//           <br />
//           Days in waiting list: {bookingDetailData.status.days_in_waiting_list}
//           <br />
//         </>
//       ),
//     },
//     {
//       label: "Room",
//       children: (
//         <>
//           {Object.entries(bookingDetailData.room_type).map(
//             ([roomType, rooms], index) => (
//               <Card
//                 key={index}
//                 title={`Room Type: ${roomType}`}
//                 type="inner"
//                 style={{ marginTop: 16 }}
//               >
//                 {rooms.map((room, idx) => (
//                   <Descriptions
//                     key={idx}
//                     bordered
//                     column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
//                   >
//                     <Descriptions.Item label="Meal">
//                       {room.meal}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Adults">
//                       {room.adults}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Children">
//                       {room.children}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Babies">
//                       {room.babies}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Car Parking">
//                       {room.parking_spaces}
//                     </Descriptions.Item>
//                     <Descriptions.Item label="Room No">
//                       {room.room_no}
//                     </Descriptions.Item>
//                   </Descriptions>
//                 ))}
//               </Card>
//             )
//           )}
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Descriptions
//         title="Booking Detail"
//         bordered
//         items={items}
//       ></Descriptions>
//       <Button
//         type="primary"
//         onClick={() => navigate(-1)} // Điều hướng trở về trang trước đó
//       >
//         <span className="span-text">Go Back</span>
//       </Button>
//     </div>
//   );
// };

const BookingDetail: React.FC = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const Id = path.split("/").pop();

  const [bookingDetailData, setBookingDetailData] =
    useState<BookingDetailData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(
          `http://localhost:8000/api/booking/detail/?booking_id=${Id}`
        );
        const result: ApiResponse = response.data;
        console.log(result);
        setBookingDetailData(result.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    fetchData();
  }, [Id]);

  if (!bookingDetailData) return <p>Loading...</p>;

  const items: DescriptionsProps["items"] = [
    {
      label: "ID",
      children: bookingDetailData.field_id,
    },
    {
      label: "Check-in",
      children: bookingDetailData.check_in,
    },
    {
      label: "Check-out",
      children: bookingDetailData.check_out,
    },
    {
      label: "Room Selected",
      children: Object.keys(bookingDetailData.room_type || {}).length.toString(),
    },
    {
      label: "Repeated Guest",
      children: bookingDetailData.is_repeated_guest ? "Yes" : "No",
    },
    {
      label: "Distribution Channel",
      children: bookingDetailData.distribution_channel,
    },
    {
      label: "Payment",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: bookingDetailData.payment ? (
        <>
          Method: {bookingDetailData.payment_method.name}
          <br />
          Original Amount: {bookingDetailData.payment.original_amount || 0} VND
          <br />
          Amount: {bookingDetailData.payment.amount || 0} VND
          <br />
          Deposit Type: {bookingDetailData.payment.deposit_type || "N/A"}
          <br />
          Discount: {((bookingDetailData.payment.discount || 0) * 100).toFixed(
            0
          )}
          %<br />
          Credit Card: {bookingDetailData.payment.credit_card || "N/A"}
        </>
      ) : (
        <>No payment information available.</>
      ),
    },
    {
      label: "Status",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      children: (
        <>
          Reservation Status: {bookingDetailData.status.reservation_status}
          <br />
          Reservation Status Date:{" "}
          {bookingDetailData.status.reservation_status_date.replace('T', ' ')}
          <br />
          Special Request: {bookingDetailData.status.special_request}
          <br />
          Days in waiting list: {bookingDetailData.status.days_in_waiting_list}
          <br />
        </>
      ),
    },
    {
      label: "Room",
      children: Object.keys(bookingDetailData.room_type || {}).length > 0 ? (
        <>
          {Object.entries(bookingDetailData.room_type).map(
            ([roomType, rooms], index) => (
              <Card
                key={index}
                title={`Room Type: ${roomType}`}
                type="inner"
                style={{ marginTop: 16 }}
              >
                {rooms.map((room, idx) => (
                  <Descriptions
                    key={idx}
                    bordered
                    column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                  >
                    <Descriptions.Item label="Meal">
                      {room.meal || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Adults">
                      {room.adults || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Children">
                      {room.children || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Babies">
                      {room.babies || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Car Parking">
                      {room.parking_spaces || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Room No">
                      {room.room_no}
                    </Descriptions.Item>
                  </Descriptions>
                ))}
              </Card>
            )
          )}
        </>
      ) : (
        <>No room information available.</>
      ),
    },
  ];

  return (
    <div>
      <Descriptions title="Booking Detail" bordered items={items}></Descriptions>
      <Button
        type="primary"
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        <span className="span-text">Go Back</span>
      </Button>
    </div>
  );
};

export default BookingDetail;

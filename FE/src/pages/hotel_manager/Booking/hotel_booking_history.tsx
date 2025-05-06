import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { message } from "antd";
import { Table, type TableProps } from "antd";
import { Modal } from "antd"

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = TableProps["pagination"];

interface BookingData {
  field_id: string;
  reservation_status: boolean;
  booking_date: Date;
  check_in: Date;
  check_out: Date;
  stays_day: number;
  amount: number;
}

interface Props {
  hotelId: string | null | undefined;
}

const HotelBookingHistory: React.FC<Props> = ({ hotelId }) => {
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const [tableParams, setTableParams] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
  });

  const fetchBookingData = useCallback(
    async (page: number, pageSize: number) => {
      if (!hotelId) {
        setError("No hotel ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(`http://localhost:8000/api/booking/`, {
          params: {
            hotel_id: hotelId,
            page,
            page_size: pageSize,
          },
        });

        const { data, total } = response.data;

        const bookings: BookingData[] = data
          .map((item: any) => ({
            field_id: item.field_id,
            reservation_status: item.reservation_status,
            booking_date: item.booking_date,
            check_in: item.check_in,
            check_out: item.check_out,
            stays_day: item.stays_day,
            amount: item.price,
          }))
          // Sort by booking_date in ascending order
          .sort(
            (a, b) =>
              new Date(b.booking_date).getTime() -
              new Date(a.booking_date).getTime()
          );

        setBookingData(bookings);
        setTotalRecords(total);
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError("Error fetching booking data");
      } finally {
        setLoading(false);
      }
    },
    [hotelId]
  );

  const handleCancel = (fieldId: string) => {
    Modal.confirm({
      title: "Are you sure you want to cancel this booking?",
      content: "This action cannot be undone.",
      okText: "Yes, Cancel",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.post(`http://localhost:8000/api/booking/cancel/`, { booking_id: fieldId });
          message.success("Booking has been canceled successfully!");
          fetchBookingData(tableParams.current!, tableParams.pageSize!); // Refresh data
        } catch (error) {
          console.error("Error canceling booking:", error);
          message.error("Failed to cancel booking.");
        }
      },
    });
  };
  
  const handleCheckout = (fieldId: string) => {
    Modal.confirm({
      title: "Are you sure you want to check out this booking?",
      content: "This action cannot be undone.",
      okText: "Yes, Checkout",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.post(`http://localhost:8000/api/booking/checkout/`, { booking_id: fieldId });
          message.success("Booking has been checked out successfully!");
          fetchBookingData(tableParams.current!, tableParams.pageSize!); // Refresh data
        } catch (error) {
          console.error("Error during checkout:", error);
          message.error("Failed to check out booking.");
        }
      },
    });
  };
  

  useEffect(() => {
    fetchBookingData(tableParams.current!, tableParams.pageSize!);
  }, [hotelId, tableParams.current, tableParams.pageSize, fetchBookingData]);

  const columns: ColumnsType<BookingData> = [
    {
      title: "Booking Id",
      dataIndex: "field_id",
    },
    {
      title: "Status",
      dataIndex: "reservation_status",
    },
    {
      title: "Book Date",
      dataIndex: "booking_date",
      sorter: true,
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Check In",
      dataIndex: "check_in",
    },
    {
      title: "Check Out",
      dataIndex: "check_out",
    },
    {
      title: "Stays Day",
      dataIndex: "stays_day",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => {
        const isNoShow = record.reservation_status === "No-Show";
  
        return (
          <>
            <a style={{ marginRight: 10 }} href={`booking/${record.field_id}`}>
              Detail
            </a>
            {isNoShow && (
              <>
                <a
                  style={{
                    marginRight: 10,
                    color: "white",
                    backgroundColor: "red",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCancel(record.field_id)}
                >
                  Cancel
                </a>
                <a
                  style={{
                    color: "white",
                    backgroundColor: "green",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCheckout(record.field_id)}
                >
                  Checkout
                </a>
              </>
            )}
          </>
        );
      },
    },
  ];

  const handleTableChange: TableProps<BookingData>["onChange"] = (
    pagination
  ) => {
    setTableParams({
      ...tableParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <div>
      <Table<BookingData>
        columns={columns}
        rowKey={(record) => record.field_id}
        dataSource={bookingData}
        pagination={{
          ...tableParams,
          total: totalRecords,
        }}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default HotelBookingHistory;

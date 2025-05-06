import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, type TableProps } from "antd";

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
  userId: string | null | undefined;
}

const GuestBookingHistory: React.FC<Props> = ({ userId }) => {
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
      if (!userId) {
        setError("No hotel ID provided");
        setLoading(false);
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await axios.get(
          `http://localhost:8000/api/booking/`,
          {
            params: {
              guest_id: userId,
              page,
              page_size: pageSize,
            },
          }
        );
  
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
    [userId]
  );

  useEffect(() => {
    fetchBookingData(tableParams.current!, tableParams.pageSize!);
  }, [userId, tableParams.current, tableParams.pageSize, fetchBookingData]);

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
      render: (record) => <a href={`booking/${record.field_id}`}>Detail</a>,
    },
  ];

  const handleTableChange: TableProps<BookingData>["onChange"] = (pagination) => {
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

export default GuestBookingHistory;
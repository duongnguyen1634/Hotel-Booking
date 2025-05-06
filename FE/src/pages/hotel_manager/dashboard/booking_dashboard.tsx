import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Row, Col, Card, Spin, Typography, Select } from "antd";
import {
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";


const { Title } = Typography;

interface BookingDashboardData {
  totalBookings: number;
  totalRooms: number;
  totalRevenue: number;
  avgStayDuration: number;
  reservationStatusData: { name: string; value: number; color: string }[];
  revenueChartData: { month: string; revenue: number }[];
}

interface DashboardProps {
  hotelId: string | null | undefined;
}

const BookingDashboard: React.FC<DashboardProps> = ({ hotelId }) => {
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [roomType, setRoomType] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const fetchRoomTypes = useCallback(async () => {
    if (!hotelId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/roomtypes/`, {
        params: { hotel_id: hotelId },
      });
      const types = response.data.data || [];
      setRoomTypes(["All", ...types]); // Add "All" option at the beginning
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const handleRoomTypeChange = (value: string) => {
    setRoomType(value === "All" ? null : value);
  };

  const fetchBookingDashboard = useCallback(async () => {
    if (!hotelId) return;

    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:8000/api/dashboard/`, {
        params: { hotel_id: hotelId, room_type: roomType },
      });

      const { data } = response.data;

      // Transform data for charts and cards
      const reservationStatusData = data.reservation_status_counts.map(
        (item: any, index: number) => ({
          name: item.reservation_status,
          value: item.count,
          color: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][index % 4],
        })
      );

      const revenueChartData = data.revenue_by_month.map((item: any) => ({
        month: new Date(0, item.month - 1).toLocaleString("default", {
          month: "short",
        }),
        revenue: item.total_revenue,
      }));

      setBookingData({
        totalBookings: data.total_bookings,
        totalRooms: data.total_rooms,
        totalRevenue: data.total_revenue,
        avgStayDuration: data.avg_stay_duration,
        reservationStatusData,
        revenueChartData,
      });
    } catch (error) {
      console.error("Error fetching booking dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [hotelId, roomType]);

  useEffect(() => {
    fetchBookingDashboard();
  }, [fetchBookingDashboard]);

  // Aggregate Data

  // Transform Data for Charts

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Booking Dashboard</Title>

      {loading ? (
        <Spin tip="Loading...">
          <div style={{ height: "300px" }} />
        </Spin>
      ) : bookingData ? (
        <>
          <div>
            {roomTypes.length === 0 ? (
              <Spin tip="Loading Room Types..." />
            ) : (
              <Select
                style={{ width: 200, marginBottom: "20px" }}
                placeholder="Select Room Type"
                onChange={handleRoomTypeChange}
                value={roomType || "All Room Type"}
              >
                {roomTypes.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
          {/* Summary Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
            <Col span={6}>
              <Card title="Total Bookings">{bookingData.totalBookings}</Card>
            </Col>
            <Col span={8}>
              <Card title="Total Revenue (Thousands VND)">
                {bookingData.totalRevenue.toFixed(2)} VND
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Average Stay Duration">
                {bookingData.avgStayDuration.toFixed(2)} Days
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row gutter={[16, 16]}>
            {/* Reservation Status Pie Chart */}
            <Col xs={24} md={12}>
              <Card title="Reservation Status">
                {/* <div style={{ textAlign: "center" }}> */}
                {/* Caption */}
                {/* <p>
                    The chart shows the distribution of reservation statuses as
                    a percentage of total bookings.
                  </p>
                </div> */}
                <div style={{ width: 400, overflow: "auto", maxHeight: 300 }}>
                  <PieChart width={400} height={400}>
                    <Pie
                      dataKey="value"
                      data={bookingData.reservationStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={false} // Disable labels on the chart
                      fill="#8884d8"
                    >
                      {bookingData.reservationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                  <div>
                    {bookingData.reservationStatusData.map((entry) => (
                      <div
                        key={entry.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <span>{entry.name}</span>
                        <span>
                          {entry.value} (
                          {(
                            (entry.value / bookingData.totalBookings) *
                            100
                          ).toFixed(2)}
                          %)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>

            {/* Revenue by Month Bar Chart */}
            <Col xs={24} md={12}>
              <Card title="Revenue by Month (Thousands VND)">
                <BarChart
                  width={500}
                  height={300}
                  data={bookingData.revenueChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default BookingDashboard;

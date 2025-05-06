import React, { useState, useEffect } from "react";
import { Button} from 'antd';
import { Divider, Typography } from 'antd';
import { Rate } from 'antd';
import { Col, Row } from 'antd';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import image1 from "../../../../src/assets/main page 1.jpg";
import dayjs from 'dayjs';

const searchButton:React.CSSProperties={
  color: '#fff',
  fontWeight: 'bold',
  order: '1px #fff',
  background: '#3AAFA9',
  width: '60%',
  height: '50px'
};

const { Title, Paragraph, Text } = Typography;

const HotelCheckin: React.FC = () => {
  const {state} = useLocation();
  const [hotels, setHotels] = useState<any[]>([]); // Khai báo state cho danh sách khách sạn
  const { destination, checkIn, checkOut, guests, rooms } = state || {};
  const savedData = JSON.parse(localStorage.getItem("searchData") || "{}");
  //console.log("Saved Check-In:", savedData.checkIn);
  //console.log("Saved Check-Out:", savedData.checkOut);

  const checkInFormatted = dayjs(checkIn).format('YYYY-MM-DD');
  const checkOutFormatted = dayjs(checkOut).format('YYYY-MM-DD');
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/hotel/search', {
          destination,
          checkIn: checkInFormatted,
          checkOut: checkOutFormatted,
          guests,
          rooms,
        });
        setHotels(response.data.hotels); // Lưu danh sách khách sạn vào state
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, [destination, checkIn, checkOut, guests, rooms]);
  
  const navigate = useNavigate();  // Khởi tạo useNavigate
  /*const handleDetailClick = (hotelId: string) => {
    // Điều hướng đến trang hotel-detail và truyền thông tin khách sạn qua route
    navigate(`../../:${hotelId}`);
  };
  */
  if (!hotels || !Array.isArray(hotels) || hotels.length === 0) {
    return <div>No hotels found for the selected destination.</div>;
  }

  /*
  useEffect(() => {
    // Gửi yêu cầu tìm kiếm từ frontend
    if (!destination || !checkIn || !checkOut || !guests || !rooms) {
      console.error("Missing search parameters.");
      return;
    }
    axios
      .get("http://localhost:8000/api/hotel/search", {
        params: {
          destination,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          rooms
        }
      })
      .then((response) => {
        //console.log(response.data);
        setHotelData(response.data || []);  // Cập nhật kết quả tìm kiếm vào state
      })
      .catch((error) => {
        console.error("Error fetching hotel data:", error);
      });
  }, [destination, checkIn, checkOut, guests, rooms]);
  */

  //const handleDetailClick = (hotelId: string) => {
    // Điều hướng tới trang chi tiết của khách sạn
    //navigate(`/hotel-detail/${hotelId}`);
  //};

  return (
    <div>
      <Divider/>
      <h1 style={{padding:'10px'}}> Hotel checkin</h1>
    
      <>
          {hotels.map((hotel) => (  
              <Row key={hotel.field_id} style={{border: '0.5px #fff solid', borderRadius: '10px', padding: '10px'}}>
              <Col span={1}/>
              <Col span={22}>
                <Row style={{border: '0.5px black solid', borderRadius: '10px', padding: '10px'}}>
                <Col span={10}>
                <div>
                    <img src={hotel.img || image1} alt="Hotel image" style={{ width: "95%", height: "auto" }}/>
                </div>
                </Col>
                <Col span={10}>
                <Typography>
                  <Title level={3}>
                    {hotel.name}
                  </Title>
                  <p><i>{`${hotel.city}, ${hotel.street}`}</i></p>
                  <Text strong>Property Overview</Text>
                    <Paragraph>
                      <ul>
                        {hotel.services && hotel.services.map((service: any, index: number) => (
                          <li key={index}>{service.service_name}</li>
                        ))}
                      </ul>
                    </Paragraph>        
                </Typography>
                </Col>
                <Col span={4}>
                  <Rate allowHalf disabled defaultValue={hotel.avg_rating || 0}/>
                  <p><i>{hotel.num_rating || 0} reviews </i></p>
                  {/* Nút "Detail" giờ gọi handleDetailClick để điều hướng */}
                  <Button style={searchButton} onClick={() => {
                    const hotelId = hotel.field_id.split('-')[1]; // Lấy phần sau "hotel-" để có được ID
                    navigate(`/guest/hotel/${hotelId}`, { state: { hotelInfo: hotel, destination, checkIn: savedData.checkIn, checkOut: savedData.checkOut, guests, roomsNumber: rooms}, });
                  }}>
                    Detail
                  </Button>
                </Col>
                
                </Row>
        
                
              </Col>
              <Col span={1}/>
              </Row>
          ))
          }
      </>     
    </div>
  );
};
export default HotelCheckin;
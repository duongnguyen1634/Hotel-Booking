import React, {useEffect, useState} from "react";
import { useLocation } from 'react-router-dom';
import { Button, Flex, message} from 'antd';
import { Divider, Typography } from 'antd';
import { Rate } from 'antd';
import { Col, Row } from 'antd';
import { useNavigate } from "react-router-dom";
import { InputNumber } from 'antd';
import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import image1 from "../../../../src/assets/hotel_pic_1.jpg";
import image2 from "../../../../src/assets/hotel 1 1.jpg";
import axios from "axios";
import { useAuth } from "../../SSO/Login/useAuth";

const { Title, Paragraph, Text } = Typography;

const boxStyle:React.CSSProperties={
  color: '#fff',
  fontWeight: 'bold',
  order: '1px #fff',
  background: '#3AAFA9',
  width: '100%',
  height: '40px'
};

const options: SelectProps['options'] = [
  { label: 'BB', value: 'BB' },
  { label: 'HB', value: 'HB' },
  { label: 'FB', value: 'FB'},
];

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};


const HotelDetail: React.FC = () => {
  //user-infor
  const { user } = useAuth();
  //console.log(user?.email)

  const {state} = useLocation();
  const {
    hotelInfo,
    checkIn,
    checkOut,
    guests,
    roomsNumber
  } = state || {};
  //console.log(hotelInfo,checkIn, checkOut, guests, roomsNumber)
  const path = window.location.pathname;
  const Id = path.split("/").pop();
  //const {hotelInfo } = state || {};
  const [rooms, setRooms] = useState<any[]>([]); // Dữ liệu phòng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const navigate = useNavigate(); 

  const handleRoomChange = (roomType: string, field: string, value: any) => {
    console.log(`Updating room ${roomType}, field: ${field}, new value: ${value}`);
    const updatedRooms = rooms.map((room) => {
      if (room.room_type === roomType) {
        return {
          ...room,
          [field]: value,
        };
      }
      return room; // Giữ nguyên các phòng không trùng room_type
    });

    setRooms(updatedRooms); // Cập nhật lại state rooms
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/hotel/detail/?hotel_id=${Id}`
        ); 
        //console.log("Fetched rooms:", response.data);
        // Kiểm tra nếu response.data là mảng
      if (Array.isArray(response.data.rooms)) {
        setRooms(response.data.rooms); // Lưu dữ liệu phòng vào state
      } else {
        setRooms([]); // Nếu không phải mảng, set empty array
      }
      setLoading(false);
      } catch (error) {
        console.error("Error fetching room data: ", error);
        setRooms([]);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [Id]);
  
  if (loading) {
    return <div>Loading rooms...</div>;
  }
  
  const handleBooking = async () => {
    if (!rooms || rooms.length === 0) {
      console.error("No room data available.");
      return;
    }
  
    // Tính tổng giá cho từng phòng và tổng cộng
    /*const bookingDetails = rooms.map((room) => {
      const roomCost = room.numberOfRooms * room.price; // Tổng giá cho từng loại phòng
      return {
        type: room.room_type,
        quantity: room.numberOfRooms || 0,
        price_per_night: room.price,
        total_price: roomCost || 0, // Giá cho phòng này
        selected_services: room.selectedServices || [],
        parking_spaces: room.parkingSpaces || 0,
      };
    });
    const totalCost = bookingDetails.reduce(
      (acc, room) => acc + (room.total_price || 0),
      0
    );

    const bookingData = {
      guest_email: user?.email, 
      hotel_id: hotelInfo.field_id,
      check_in: checkIn,  
      check_out: checkOut, 
      total_cost: totalCost,
      //room_details: bookingDetails,
    };*/

    const roomDetails = rooms
    .filter((room) => room.numberOfRooms > 0) // Chỉ lấy phòng được chọn
    .map((room) => ({
      type: room.room_type,
      quantity: room.numberOfRooms,
      meal: room.selectedServices,
      parking_spaces: room.parkingSpaces,
    }));

  const totalCost = rooms.reduce(
    (acc, room) => acc + (room.numberOfRooms * room.price || 0),
    0
  );
  // Dữ liệu gửi đến backend
  const bookingData = {
    guest_email: user?.email,
    hotel_id: hotelInfo.field_id,
    check_in: checkIn,
    check_out: checkOut,
    guests: guests,
    total_cost: totalCost,
    room_details: roomDetails, // Gửi thông tin chi tiết về các loại phòng
  };
    console.log("Booking Data:", bookingData);

    try {
      const response = await axios.post("http://localhost:8000/api/guest/booking/", bookingData);
      console.log("Booking success:", response.data);
      navigate(`/guest/booking`);
      message.success("Booking created successfully!");
    } catch (error) {
      console.error("Error creating booking:", error);
      message.error("Booking failed. Please try again.");
    }
    
  };

  return (
    <div>
      <h1>Hotel Detail</h1>
      <Flex gap="middle" align="flex-start" style={{padding: '10px 10px'}}>
        <Typography>
          <Title level={2}>Hotel-{hotelInfo.city}</Title>
          <Rate allowHalf disabled defaultValue={3}/>
          <Paragraph>{`${hotelInfo.city}, ${hotelInfo.street}`}</Paragraph>
        </Typography>
        <Flex justify='flex-end' align='center'>
          <Button style={boxStyle}
             onClick={() => navigate(`/guest/hotel`)}
          >Go back</Button>
        </Flex>
      </Flex>
      <>
        <Row style={{border: '0.5px #fff solid', borderRadius: '10px', padding: '10px'}}>
          <Col span={1}/>
          <Col span={23}>
            <Row style={{border: '0.5px #fff solid', borderRadius: '10px', padding: '10px'}}>
                <Col span={14}>
                  <div>
                  <img src={hotelInfo.img || image1} alt="Hotel image" style={{ width: "95%", height: "auto" }}/>
                  </div>
                </Col>
                <Col span={10}>
                  <Flex vertical>
                  <div>
                  <img src={hotelInfo.img || image2} alt="Hotel image" style={{ width: "95%", height: "auto" }}/>
                  </div>
                  <div>
                  <img src={hotelInfo.img || image2} alt="Hotel image" style={{ width: "95%", height: "auto" }}/>
                  </div>
                  </Flex>
                </Col>
            </Row>
            <Typography>
                <Title level={3}>Details</Title>
              </Typography>
              <Divider/>
            <Row style={{border: '0.5px black solid', borderRadius: '10px', padding: '10px', gap:'40px'}}>
              <Col span={11}>
                <Typography>
                  <Title level={4}>About hotel</Title>
                  <Paragraph>
                    {hotelInfo.description}
                  </Paragraph>
                </Typography>
              </Col>
              <Col span={5}>
                <Typography>
                  <Title level={4}>Price Range</Title>
                  <Paragraph>{hotelInfo.min_price} - {hotelInfo.max_price} VND</Paragraph>
                  <Title level={4}>Properties overview</Title>
                  <ul>
                      {hotelInfo.services && hotelInfo.services.map((service: any, index: number) => (
                        <li key={index}>{service.service_name}</li>
                        ))} 
                  </ul>
                </Typography>
              </Col>
              <Col span={4}>
                <Typography>
                  <Title level={4}>
                    Meals
                  </Title>
                  <Paragraph>
                    Breakfast, Lunch, Dinner, Brunch
                  </Paragraph>
                </Typography>
              </Col>
            </Row>

            
            <Typography>
                <Title level={3}>Best match</Title>
            </Typography>
              <Divider/>
              {rooms.length === 0 ? (
                <div>No rooms available</div>
                ) : (
                rooms.map((room , index: any) =>                   
                  <div key={index}>
                    <Row style={{border: '0.5px black solid', borderRadius: '10px', padding: '10px', gap:'40px'}}>
                    <Col span={8}>
                      <Typography>
                        <Title level={4}>Room {room.room_type}</Title>
                      </Typography>            
                            <div>
                              <img src={image1} alt="Hotel image" style={{ width: "95%", height: "auto" }}/>
                            </div>
                      {/*                       
                       <Typography>
                            <Title level={5}>Facilities</Title>
                          <ul>
                              <li>Room size: {room.size}</li>
                          </ul>
                        </Typography>
                      */}
                    </Col>
                    <Col span={6}>
                      <Typography>
                        <Title level={5}>Benefits</Title>
                        <ul>
                        {Array.isArray(room.services) && room.services.map((service: string, idx: number) => (
                          <li key={idx}>{service}</li>
                        ))}
                        </ul>
                      </Typography>
                    </Col>
                    <Col span={5}>
                    <Typography>
                      <Title level={5}>Price per night</Title>
                        <Paragraph>
                          <Title level={4} >{room.price}</Title>VND
                        </Paragraph>
                        <Text strong>Remaining  </Text> 
                        <Button disabled>{room.vacant}</Button>
                        <Text></Text>          
                    </Typography>
                    <Text>Number of rooms:   </Text>
                      <InputNumber placeholder="Rooms" min={1} max={room.vacant} 
                      value={room.numberOfRooms} // Giá trị từ state
                      onChange={(value) => handleRoomChange(room.room_type, 'numberOfRooms', value)} />      
                        <Text>Choose your services</Text>
                        <Space style={{ width: '100%' }} direction="vertical">
                          <Select
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Services"
                            value={room.selectedServices} // Giá trị từ state
                            onChange={(value) => handleRoomChange(room.room_type, 'selectedServices', value)}
                            options={options}
                          />          
                        </Space> 
                        <Text>Select the number of parking spaces:   </Text>
                        <InputNumber placeholder="Quantity?" min={0} width='100%'
                        value={room.parkingSpaces} // Giá trị từ state
                        onChange={(value) => handleRoomChange(room.room_type, 'parkingSpaces', value)}/>               
                    </Col>
                    
                    </Row>
                    
                  </div>
                )
              )}
              
          </Col>
        </Row>
      </>
      <Button style={boxStyle} 
        onClick={handleBooking} >
      BOOK NOW</Button>
    </div>
  );
};
export default HotelDetail;
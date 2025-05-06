import React, {useState} from "react";
import { Outlet} from "react-router-dom";
import { Button, Flex, Dropdown, Menu, Space, Divider} from 'antd';
import { InputNumber } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

//import axios from 'axios';


//
type MenuItem = {
  label: string;
  key: string;
};

const boxStyle1: React.CSSProperties = {
  border: '#fff',
  width: '100%',
  height: '100vh',
};


const divStyle = {
  backgroundImage: 'url("../../../../src/assets/main page 1.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
};

const containerStyle: React.CSSProperties = {
  border: '1px solid #fff',
  color: 'black',
  background: '#fff',
  padding: '10px 20px 10px 0px',
  borderRadius: '10px',
  gap: '20px',
  width: '80%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
};

const containerStyle2: React.CSSProperties = {
  border: '1px solid #fff',
  borderRadius: '10px',
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
  color: 'black',
  alignItems: 'center'
};

/*const onClick: MenuProps['onClick'] = ( {key} ) => {
  message.info(`Click on item ${key}`);
  console.log('onClick',key);
};*/

//
const items: MenuItem[] = [
  { label: 'Ho Chi Minh City', key: "Ho Chi Minh" },
  { label: 'Vung Tau City', key: 'Vung Tau' },
];

const searchButton:React.CSSProperties={
  color: '#fff',
  fontWeight: 'bold',
  order: '1px #fff',
  background: '#3AAFA9',
  width: '60%',
  height: '50px'
};

/*
const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const onChangeDate: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};
*/


const HotelSearching: React.FC = () => {
  //const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState<string | null>(null);
  const [rooms, setRooms] = useState<number | null>(null);
  //const [guests, setGuests] = useState<number | null>(null);
  const [adults, setAdults] = useState<number| null>(null); // Số lượng người lớn
  const [children, setChildren] = useState<number| null>(null); // Số lượng trẻ em
  const [babies, setBabies] = useState<number| null>(null); // Số lượng trẻ sơ sinh

  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [selectedItem, setSelectedItem] = useState('Your Destination?');
  const navigate = useNavigate();

   // Hàm xử lý khi chọn địa điểm
   const handleMenuClick = (event: { key: string }) => {
    setDestination(event.key);
    setSelectedItem(event.key);
  };

  /*
  useEffect(() => {
    axios
      .get('/api/hotels')
      .then((response) => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  }, []);

  const handleMenuClick = (event: { key: string }) => {
    setDestination(event.key);
  };
  */
  // const onChangeGuests: InputNumberProps["onChange"] = (value: number | string | null) => {
  //   setGuests(value as number);
  // };
  // const onChangeAdults: InputNumberProps["onChange"] = (value: number | string | null) => {
  //   setAdults(value as number);
  // };
  // const onChangeChildren: InputNumberProps["onChange"] = (value: number | string | null) => {
  //   setChildren(value as number);
  // };
  // const onChangeBabies: InputNumberProps["onChange"] = (value: number | string | null) => {
  //   setBabies(value as number);
  // };
  // const onChangeRooms: InputNumberProps["onChange"] = (value: number | string | null) => {
  //   setRooms(value as number);
  // };

  // const onChangeCheckIn: DatePickerProps<Dayjs>["onChange"] = (date: Dayjs | null) => {
  //   setCheckIn(date);
  // };

  // const onChangeCheckOut: DatePickerProps<Dayjs>["onChange"] = (date: Dayjs | null) => {
  //   setCheckOut(date); };
  
  const onChangeAdults = (value: number | string | null) => setAdults(value as number);
  const onChangeChildren = (value: number | string | null) => setChildren(value as number);
  const onChangeBabies = (value: number | string | null) => setBabies(value as number);
  const onChangeRooms = (value: number | string | null) => setRooms(value as number);
  const onChangeCheckIn = (date: Dayjs | null) => setCheckIn(date);
  const onChangeCheckOut = (date: Dayjs | null) => setCheckOut(date);
  const guests = { adults, children, babies };

  localStorage.setItem("searchData", JSON.stringify({ destination, checkIn, checkOut, guests, rooms }));

   // Hàm xử lý khi bấm "Search"
   const handleSearch = async () => {
    if (!destination || !checkIn || !checkOut || !rooms) {
      alert('Please fill in all fields.');
      return;
    }

    if (!guests.adults){
      alert('Must have at least 1 adult.');
      return;
    }
    if (checkIn.isBefore(dayjs(), "day")) {
      alert("Check-in date cannot be in the past.");
      return;
    }

    if (checkIn.date() > checkOut.date() ) {
      alert('Invalid date');
      return;
    }

    if (checkIn.isBefore(dayjs(), "day")) {
      alert("Check-in date cannot be in the past.");
      return;
    }
    
    // Kiểm tra xem ngày check-in có cách ngày hiện tại ít nhất 7 ngày không
    const today = dayjs(); // Ngày hiện tại
    const sevenDaysLater = today.add(7, 'days'); // Ngày hiện tại cộng thêm 7 ngày

    if (checkIn.isAfter(sevenDaysLater, 'day')) {
      alert("Check-in date must be within 7 days from today.");
      return;
    }

    if (checkIn.isAfter(checkOut, "day") ) {
      alert('Chech-in date must after check-out date');
      return;
    }

    navigate("/guest/hotel/search/checkin", {
      state: { destination, checkIn, checkOut, guests, rooms},
    });
     // Điều hướng đến trang hotel_checkin với các tham số tìm kiếm
     //const searchParams = {
      //destination,
      //checkIn: checkIn.format('YYYY-MM-DD'),
      //checkOut: checkOut.format('YYYY-MM-DD'),
      //guests,
      //rooms,
      
   }
    /*try {
    const response = await axios.post("http://localhost:8000/api/hotel/search", 
      {
        searchParams
      }
    )
    console.log(response.data);
    if (response.status === 200) {
      // Navigate đến trang checkin với dữ liệu trả về
      navigate('/guest/hotel/search/checkin', {
        state: response.data, // dữ liệu khách sạn trả về
      });
    }
    } catch (error) {
      console.error('Error searching for hotels:', error);
      alert('No hotels found. Please try different search criteria.');
    }
    
  };*/
  

  const menu = (
    <Menu onClick={handleMenuClick}>
      {items.map(item => (
        <Menu.Item key={item.key}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  console.log('Destination:', destination); //string
  console.log('CheckIn:', checkIn?.format('YYYY-MM-DD')); //Dayjs
  console.log('CheckOut:', checkOut?.format('YYYY-MM-DD')); //-
  console.log('Guests:', guests); //number
  console.log('Rooms:', rooms); //-


  return (
    <div style={divStyle}>
      <h1 style={{padding: '20px 0px 0px 20px'}}>Hotel Searching</h1>
      <Flex style={boxStyle1} justify={'center'} align={'flex-end'}>
        <div style={containerStyle}>
          <div style={containerStyle2}>
            <div style={containerStyle}>
              <Dropdown overlay={menu}>
                <a onClick={(e) => e.preventDefault()}>
                <Space>
                <Button>{selectedItem}
                <DownOutlined />
                </Button>
                </Space>
                </a>
              </Dropdown>          
            {/* <InputNumber style={{ width: 200}} placeholder="Number of Guests" min={1} onChange={onChangeGuests}/> */}
            <InputNumber style={{ width: 200 }} placeholder="Adults" min={1} onChange={onChangeAdults} value={adults} />
            <InputNumber style={{ width: 200 }} placeholder="Children" min={0} onChange={onChangeChildren} value={children} />
            <InputNumber style={{ width: 200 }} placeholder="Babies" min={0} onChange={onChangeBabies} value={babies} />

            </div>
            <div style={containerStyle}>
              <DatePicker placeholder="Check-in Date" onChange={onChangeCheckIn} needConfirm />
              <DatePicker placeholder="Check-out Date" onChange={onChangeCheckOut} needConfirm />
              <InputNumber style={{ width: 200}} placeholder="Number of Rooms" min={1} onChange={onChangeRooms}/>
            </div>
          </div>
          <Button style={searchButton} onClick={handleSearch}>Search</Button>
        </div>
      </Flex>
      <Space>
      <Divider/>
      </Space>
      <Outlet />
      
    </div>
  );

};
export default HotelSearching;
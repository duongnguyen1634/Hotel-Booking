import React, { useEffect, useState } from "react";
import { Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { List } from "antd";
import axios from "axios";
import image1 from "../../../assets/hotel 1 1.jpg";

interface ImageItem {
  title: string;
  imageUrl: string;
  description: string;
  status: number;
  services: string[];
}
interface Props {
  hotelId: string | null | undefined;
}

const RoomType: React.FC<Props> = ({ hotelId }) => {
  const [data, setData] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleShowAllRooms = (roomType: string) => {
    navigate(`/hotel/room/${roomType}`);
  };

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/roomtype/`,
          {
            params: {
              hotel_id: hotelId,
            },
          }
        ); // Replace with your actual API endpoint
        const roomData = response.data.data.map((item: any) => ({
          title: item.name,
          imageUrl: image1,
          description: `${item.price.toLocaleString()} VND per day`,
          status: item.vacant,
          services: item.services,
        }));
        setData(roomData);
      } catch (error) {
        console.error("Error fetching room types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Room Type</h1>
      </div>
      
      <List
        itemLayout="vertical"
        loading={loading}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item.title}>
            <div
              style={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <div style={{ flex: "30%" }}>
                <img
                  style={{ width: "100%" }}
                  alt={item.title}
                  src={item.imageUrl}
                />
              </div>
              <div style={{ flex: "60%", paddingLeft: "16px" }}>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#3AAFA9",
                    borderColor: "white",
                    pointerEvents: "none",
                    marginRight: "8px",
                  }}
                >
                  {item.title}
                </Button>
                <List.Item.Meta description={item.description} />
                <div>
                  {item.services.map((service) => (
                    <Tag
                      style={{
                        backgroundColor: "white",
                        borderColor: "white",
                        color: "gray",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                      key={service}
                    >
                      {service}
                    </Tag>
                  ))}
                </div>
              </div>
              <div style={{ flex: "30%", textAlign: "right" }}>
                <Tag
                  style={{
                    backgroundColor: "white",
                    borderColor: "white",
                    color: "#3AAFA9",
                    fontSize: "15px",
                    fontWeight: "bold",
                  }}
                >
                  {item.status}
                </Tag>
                <p style={{ margin: "2px 10px", color: "gray" }}>Vacant</p>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#3AAFA9",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                  onClick={() => handleShowAllRooms(item.title)}
                >
                  SHOW ALL ROOM
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

export default RoomType;

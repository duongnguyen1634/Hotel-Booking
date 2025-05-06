import React, { useEffect, useState } from "react";
import { Button, Rate, Tag, Modal, Select } from "antd";
import { List } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import image1 from "../../../assets/hotel 1 1.jpg";
import { Input } from "antd";
const { Option } = Select;

interface RoomItem {
  room_no: number;
  hotel: string;
  type: string;
  size: number;
  avg_rating: number;
  status: string;
  img: string | null;
}

interface Props {
  hotelId: string | null | undefined;
}

const Room: React.FC<Props> = ({ hotelId }) => {
  const [data, setData] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<RoomItem>>({
    room_no: undefined,
    hotel: hotelId || "",
    type: "",
    size: undefined,
    avg_rating: 0,
    status: "vacant",
    img: null,
  });
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RoomItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const path = window.location.pathname;
  const typ = path.split("/").pop()?.toUpperCase() || "";

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      if (!hotelId) {
        console.error("hotelId is required but not provided");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/rooms/", {
          params: {
            hotel_id: hotelId,
            type: typ,
          },
        });
        const rooms = response.data.data.map((item: any) => ({
          room_no: item.room_no,
          hotel: item.hotel,
          type: item.type.replace("RoomType object ", ""), // Clean up type string
          size: item.size,
          avg_rating: item.avg_rating,
          status: item.status,
          img: item.img || image1, // Use placeholder image if img is null
        }));
        setData(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showModal = (item: RoomItem) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleChange = () => {
    setEditMode(true);
  };

  const handleSubmit = async () => {
    if (!currentItem) return;

    try {
      // Create an updated room object
      const updatedRoom = {
        room_no: currentItem.room_no,
        hotel_id: currentItem.hotel,
        status: status || currentItem.status, // Use updated status or fallback to the current one
        type: type || currentItem.type, // Use updated type or fallback to the current one
        size: currentItem.size,
        avg_rating: currentItem.avg_rating,
        img: currentItem.img,
      };

      // Update the backend
      await axios.put(
        `http://localhost:8000/api/rooms/${currentItem.room_no}/?hotel_id=${hotelId}`,
        updatedRoom
      );

      // Update the frontend state
      setData((prevData) =>
        prevData.map((room) =>
          room.room_no === currentItem.room_no
            ? { ...room, status: updatedRoom.status, type: updatedRoom.type }
            : room
        )
      );

      // Close modal and reset edit mode
      setEditMode(false);
      setOpen(false);
      notification.success({
        message: "Update Successful",
        description: `Room ${currentItem.room_no} has been updated successfully.`,
      });

      console.log("Room updated successfully!");
    } catch (error) {
      console.error("Error updating room:", error);

      // Show error notification
      notification.error({
        message: "Update Failed",
        description: `Failed to update Room ${currentItem?.room_no}. Please try again.`,
      });
    }
  };
  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleAddRoom = () => {
    setAddModalVisible(true);
  };

  const handleAddRoomCancel = () => {
    setAddModalVisible(false);
    setNewRoom({
      room_no: undefined,
      hotel: hotelId || "",
      type: "",
      size: undefined,
      avg_rating: 0,
      status: "vacant",
      img: null,
    });
  };

  const handleAddRoomSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/rooms/", {
        ...newRoom,
        hotel: hotelId, // Ensure hotel ID is set correctly
      });

      // Update the frontend state with the new room
      setData((prevData) => [...prevData, response.data]);

      notification.success({
        message: "Room Added Successfully",
        description: `Room ${newRoom.room_no} has been added.`,
      });

      // Close the modal
      handleAddRoomCancel();
    } catch (error) {
      console.error("Error adding room:", error);
      notification.error({
        message: "Error Adding Room",
        description: "Failed to add the new room. Please try again.",
      });
    }
  };

  const removeRoom = async (roomNo: number) => {
    try {
      // Make DELETE request to backend
      await axios.delete(`http://localhost:8000/api/rooms/${roomNo}/`, {
        params: { hotel_id: hotelId }, // Pass the hotel ID as a parameter
      });
  
      // Update frontend state
      setData((prevData) => prevData.filter((room) => room.room_no !== roomNo));
  
      // Show success notification
      notification.success({
        message: "Room Removed Successfully",
        description: `Room ${roomNo} has been removed.`,
      });
  
      console.log(`Room ${roomNo} removed successfully!`);
    } catch (error) {
      console.error("Error removing room:", error);
  
      // Show error notification
      notification.error({
        message: "Error Removing Room",
        description: `Failed to remove Room ${roomNo}. Please try again.`,
      });
    }
  };

  return (
    <>
    <Button
        type="primary"
        style={{
          marginBottom: "16px",
          backgroundColor: "#3AAFA9",
          color: "white",
          fontWeight: "bold",
        }}
        onClick={() => navigate(-1)} // Navigates back to the previous page
      >
        Go Back
      </Button>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Room</h1>
        
        {/* <Button
          type="primary"
          style={{
            marginLeft: "auto",
            backgroundColor: "#3AAFA9",
            borderColor: "white",
          }}
          onClick={handleAddRoom} // Replace with your desired event
        >
          Add Room
        </Button> */}
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
        // renderItem={(item) => (
        //   <List.Item key={item.room_no}>
        //     <div
        //       style={{ display: "flex", flexDirection: "row", width: "100%" }}
        //     >
        //       <div style={{ flex: "30%" }}>
        //         <img
        //           style={{ width: "100%" }}
        //           alt={`Room ${item.room_no}`}
        //           src={item.img || image1}
        //         />
        //       </div>
        //       <div style={{ flex: "60%", paddingLeft: "16px" }}>
        //         <Button
        //           type="primary"
        //           style={{
        //             backgroundColor: "#3AAFA9",
        //             borderColor: "white",
        //             pointerEvents: "none",
        //             marginRight: "8px",
        //           }}
        //         >
        //           {item.type}
        //         </Button>
        //         <Rate
        //           allowHalf
        //           disabled
        //           value={item.avg_rating / 20} // Convert avg_rating to 5-star scale
        //           style={{ marginRight: "8px" }}
        //         />
        //         <span>{`Size: ${item.size} sqm`}</span>
        //         <div
        //           style={{
        //             display: "flex",
        //             alignItems: "center",
        //             marginTop: "8px",
        //           }}
        //         >
        //           <List.Item.Meta
        //             title={<h3>{`Room no ${item.room_no}`}</h3>}
        //             description={
        //               <div style={{ display: "flex", alignItems: "center" }}>
        //                 <Tag
        //                   color={item.status === "varcant" ? "green" : "red"}
        //                   style={{ marginLeft: "10px" }}
        //                 >
        //                   {item.status}
        //                 </Tag>
        //               </div>
        //             }
        //           />
        //         </div>
        //       </div>
        //       <div style={{ flex: "30%" }}>
        //         <Button
        //           icon={<EditOutlined />}
        //           type="primary"
        //           style={{ backgroundColor: "#3AAFA9", borderColor: "white" }}
        //           onClick={() => showModal(item)}
        //         >
        //           Edit
        //         </Button>
        //         <Button
        //           icon={<DeleteOutlined />}
        //           type="link"
        //           danger
        //           onClick={() => removeRoom(item.room_no)} // Call removeRoom with the room number
        //         >
        //           Remove
        //         </Button>
        //       </div>
        //     </div>
        //   </List.Item>
        // )}
        renderItem={(item) => (
          <List.Item key={item.room_no}>
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <div style={{ flex: "30%" }}>
                <img
                  style={{ width: "100%" }}
                  alt={`Room ${item.room_no}`}
                  src={item.img || image1}
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
                  {item.type}
                </Button>
                <Rate
                  allowHalf
                  disabled
                  value={item.avg_rating / 20} // Convert avg_rating to 5-star scale
                  style={{ marginRight: "8px" }}
                />
                <span>{`Size: ${item.size} sqm`}</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <List.Item.Meta
                    title={<h3>{`Room no ${item.room_no}`}</h3>}
                    description={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tag
                          color={item.status === "vacant" ? "green" : "red"}
                          style={{ marginLeft: "10px" }}
                        >
                          {item.status}
                        </Tag>
                      </div>
                    }
                  />
                </div>
              </div>
              {/* <div style={{ flex: "30%" }}>
                
                <Button
                  icon={<DeleteOutlined />}
                  type="link"
                  danger
                  onClick={() => removeRoom(item.room_no)} // Call removeRoom here
                >
                  Remove
                </Button>
              </div> */}
            </div>
          </List.Item>
        )}
      />
      {/* <Modal
        open={addModalVisible}
        title="Add New Room"
        onOk={handleAddRoomSubmit}
        onCancel={handleAddRoomCancel}
        footer={[
          <Button key="cancel" onClick={handleAddRoomCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddRoomSubmit}
            style={{ backgroundColor: "#3AAFA9", borderColor: "white" }}
          >
            Add Room
          </Button>,
        ]}
      >
        <div>
          <label>Room No: </label>
          <Input
            type="number"
            value={newRoom.room_no}
            onChange={(e) =>
              setNewRoom((prev) => ({
                ...prev,
                room_no: Number(e.target.value),
              }))
            }
            style={{ width: "100%", marginBottom: "16px" }}
          />
        </div>
        <div>
          <label>Type: </label>
          <Select
            value={newRoom.type}
            onChange={(value) =>
              setNewRoom((prev) => ({ ...prev, type: value }))
            }
            style={{ width: "100%", marginBottom: "16px" }}
          >
            <Option value={typ}>{typ}</Option>
          </Select>
        </div>
        <div>
          <label>Size (sqm): </label>
          <Input
            type="number"
            value={newRoom.size}
            onChange={(e) =>
              setNewRoom((prev) => ({ ...prev, size: Number(e.target.value) }))
            }
            style={{ width: "100%", marginBottom: "16px" }}
          />
        </div>
        <div>
          <label>Status: </label>
          <Select
            value={newRoom.status}
            onChange={(value) =>
              setNewRoom((prev) => ({ ...prev, status: value }))
            }
            style={{ width: "100%", marginBottom: "16px" }}
          >
            <Option value="vacant">vacant</Option>
            <Option value="occupied">occupied</Option>
          </Select>
        </div>
      </Modal> */}
      {/* <Modal
        open={open}
        title={
          editMode
            ? `Edit Room ${currentItem?.room_no}`
            : `Room Details - ${currentItem?.room_no}`
        }
        onOk={editMode ? handleSubmit : handleOk} // Submit changes if in editMode
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          editMode && (
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              style={{ backgroundColor: "#3AAFA9", borderColor: "white" }}
            >
              Save Changes
            </Button>
          ),
        ]}
      >
        {currentItem && (
          <>
           
            <img
              src={currentItem.img || image1}
              alt={`Room ${currentItem.room_no}`}
              style={{ width: "100%", marginBottom: "16px" }}
            />

            {editMode ? (
              <>
                {/* Edit Status */}
                {/* <div>
                  <label>Status: </label>
                  <Select
                    value={status || currentItem.status}
                    onChange={handleStatusChange}
                    style={{ width: "100%", marginBottom: "16px" }}
                  >
                    <Option value="vacant">vacant</Option>
                    <Option value="full">full</Option>
                  </Select>
                </div>

                <div>
                  <label>Type: </label>
                  <Select
                    value={type || currentItem.type}
                    onChange={handleTypeChange}
                    style={{ width: "100%", marginBottom: "16px" }}
                  >
                    <Option value="Type A">Type A</Option>
                    <Option value="Type B">Type B</Option>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Status:</strong> {currentItem.status}
                </p>
                <p>
                  <strong>Type:</strong> {currentItem.type}
                </p>
              </>
            )}
            {!editMode && (
              <Button
                type="primary"
                onClick={handleChange}
                style={{
                  marginTop: "16px",
                  backgroundColor: "#3AAFA9",
                  borderColor: "white",
                }}
              >
                Edit
              </Button>
            )}

            <Button
              danger
              style={{ marginTop: "16px", marginLeft: "8px" }}
              onClick={() => console.log(`Remove Room ${currentItem.room_no}`)} // Add your remove logic here
            >
              Remove
            </Button>
          </>
        )} */}
      {/* </Modal> */} 
    </>
  );
};

export default Room;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Tabs,
  Select,
  Upload,
  Image,
  Descriptions,
  Row,
  Col,
  Divider,
  Table,
  Pagination,
  Spin,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { TextArea } = Input;

interface Employee {
  field_id: string;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  avatar: string | null;
}

interface HotelData {
  field_id: string;
  name: string;
  country: string;
  city: string;
  district: string;
  street: string;
  description: string;
  avg_rating: number;
  min_price: number;
  max_price: number;
  num_rating: number;
  type: string;
  img: string;
  number_of_room: number;
  total_booking: number;
  services: string[];
  employee: Employee[];
}

interface Props {
  hotelId: string | null | undefined;
}

interface EmployeeTableProps {
  employees: Employee[];
}

const UploadButton: React.FC = () => {
  return (
    <Upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      listType="picture"
    >
      <Button type="primary" icon={<UploadOutlined />}>
        Upload
      </Button>
    </Upload>
  );
};

interface EditHotelInformationProps extends Props {
  hotelData: HotelData | null;
  onHotelDataUpdate: (updatedData: HotelData) => void;
}

const EditHotelInformation: React.FC<EditHotelInformationProps> = ({
  hotelId,
  hotelData,
  onHotelDataUpdate,
}) => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [form] = Form.useForm();

  if (!hotelData) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/hotelinf/?hotel_id=${hotelId}`, // Backend API URL
        values
      );
      message.success("Hotel updated successfully!");
      const updatedData = response.data.data;
      onHotelDataUpdate(updatedData);
    } catch (error) {
      message.error("Failed to update hotel data");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setComponentDisabled(true);
  };

  return (
    <>
      <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Disabled Edit
      </Checkbox>

      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={componentDisabled}
        initialValues={{
          name: hotelData.name,
          type: hotelData.type,
          country: hotelData.country,
          city: hotelData.city,
          district: hotelData.district,
          street: hotelData.street,
          description: hotelData.description,
        }}
        style={{ width: "1000px" }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Hotel Type"
          name="type"
          rules={[{ required: true, message: "Please select a hotel type!" }]}
        >
          <Select style={{ width: 200 }}>
            <Select.Option value="1">Resort Hotel</Select.Option>
            <Select.Option value="2">Country Hotel</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Country" name="country">
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="Country"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              { value: "America", label: "America" },
              { value: "Viet Nam", label: "Viet Nam" },
            ]}
          />
        </Form.Item>

        <Form.Item label="City" name="city">
          <Select
            showSearch
            style={{ width: 300 }}
            placeholder="City"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              { value: "Ha Noi", label: "Ha Noi" },
              { value: "Ho Chi Minh", label: "Ho Chi Minh" },
              { value: "Vung Tau", label: "Vung Tau" },
            ]}
          />
        </Form.Item>

        <Form.Item label="District" name="district">
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item label="Street" name="street">
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item label="Image" name="image" valuePropName="fileList">
          <UploadButton />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: 150 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            htmlType="button"
            style={{ marginLeft: "10px" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const columns: ColumnsType<Employee> = [
    {
      title: "ID",
      dataIndex: "field_id",
      key: "field_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "field_id",
      key: "type",
      render: (id) => (
        <span>{id.includes("mng") ? "Manager" : "Receptionist"}</span>
      ),
    },
  ];

  // Pagination handler
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f0f2f5",
    },
    heading: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "16px",
    },
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "16px",
    },
    table: {
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Employee</h2>
      <Table
        columns={columns}
        dataSource={employees.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        pagination={false}
        rowKey="field_id"
        style={styles.table}
      />
      <div style={styles.paginationContainer}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={employees.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

interface Props {
  hotelId: string | null | undefined;
}

interface ShowHotelInformationProps {
  hotelData: HotelData | null;
}

const ShowHotelInformation: React.FC<ShowHotelInformationProps> = ({
  hotelData,
}) => {
  return (
    <div>
      <Row>
        <span style={{ width: "100vh" }}>{hotelData?.name}</span>
        <Image width={500} height={300} src={hotelData?.img || "error"} />
      </Row>
      <Row>
        <Col span={15}>
          <Descriptions title="Hotel Info" layout="vertical">
            <Descriptions.Item span={14} label="Name">
              {hotelData?.name}
            </Descriptions.Item>
            <Descriptions.Item span={14} label="Address">
              {hotelData?.street}, {hotelData?.district}, {hotelData?.city},{" "}
              {hotelData?.country}
            </Descriptions.Item>
            <Descriptions.Item span={14} label="Description">
              {hotelData?.description}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={8} style={{ marginLeft: "20px" }}>
          <Divider orientation="left">
            <Descriptions title="Overview">
              <Descriptions.Item label="Avg Rating" span={8}>
                {hotelData?.avg_rating.toFixed(1)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Booking" span={8}>
                {hotelData?.total_booking}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Rooms" span={8}>
                {hotelData?.number_of_room}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions title="Services">
              {hotelData?.services && hotelData.services.length > 0 ? (
                hotelData.services.map((service, index) => (
                  <Descriptions.Item
                    key={index}
                    span={8}
                    style={{ fontWeight: 300 }}
                  >
                    {service}
                  </Descriptions.Item>
                ))
              ) : (
                <Descriptions.Item span={8} style={{ fontWeight: 300 }}>
                  No services available
                </Descriptions.Item>
              )}
            </Descriptions>
          </Divider>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <EmployeeTable employees={hotelData?.employee || []} />
        </Col>
      </Row>
    </div>
  );
};

function callback(key) {
  console.log(key);
}

const HotelInformation: React.FC<Props> = ({ hotelId }) => {
  const [hotelData, setHotelData] = useState<HotelData | null>(null);

  // Fetch hotel data initially
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/hotelinf/?hotel_id=${hotelId}`
        );
        setHotelData(response.data.data);
      } catch (error) {
        message.error("Failed to fetch hotel data");
      }
    };
    fetchHotelData();
  }, [hotelId]);

  // Function to update hotel data
  const handleHotelDataUpdate = (updatedData: HotelData) => {
    setHotelData(updatedData);
  };

  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="Hotel Information" key="1">
        <ShowHotelInformation hotelData={hotelData} />
      </TabPane>
      <TabPane tab="Edit" key="2">
        <EditHotelInformation
          hotelId={hotelId}
          hotelData={hotelData}
          onHotelDataUpdate={handleHotelDataUpdate}
        />
      </TabPane>
    </Tabs>
  );
};

export default HotelInformation;

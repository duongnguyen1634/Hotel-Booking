import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Form, Typography, Row, Col, Avatar, Modal, Divider, message, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

interface UserInfo {
  name: string;
  email: string;
  phone_number: string;
  avatar?: string;
}

interface Props {
  userId: string | null | undefined;
}

const UserRole: React.FC<{ userId: string | null | undefined }> = ({ userId }) => {
  const getUserRole = () => {
    if (userId?.startsWith('guest')) return 'Guest';
    if (userId?.startsWith('hotel-rcp')) return 'Hotel Receptionist';
    if (userId?.startsWith('hotel-mng')) return 'Hotel Manager';
    return 'Unknown';
  };

  return (
    <div style={{ fontSize: '14px', color: '#6c757d', fontFamily: 'Arial, sans-serif' }}>
      <Text strong>Role:</Text> {getUserRole()}
    </div>
  );
};

const Account: React.FC<Props> = ({ userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [avatarInput, setAvatarInput] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/?user_id=${userId}`);
        setUserInfo(response.data.data);
        form.setFieldsValue(response.data.data);
        setLoading(false);
      } catch (error) {
        message.error('Failed to fetch user data.');
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [userId, form]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUserInfo = { ...values, avatar: userInfo?.avatar }; // Include avatar URL
      const response = await axios.put(`http://localhost:8000/api/user/?user_id=${userId}`, updatedUserInfo);
      setUserInfo(response.data.data);
      setIsEditing(false);
      message.success('Profile updated successfully.');
    } catch (error) {
      message.error('Failed to save profile.');
      console.error('Save failed:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const showAvatarModal = () => setIsAvatarModalVisible(true);

  const handleAvatarUpdate = async () => {
    if (!avatarInput.trim()) {
      message.error('Avatar URL cannot be empty.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/user/?user_id=${userId}`, {
        ...userInfo,
        avatar: avatarInput,
      });
      setUserInfo(response.data.data);
      setAvatarInput("");
      setIsAvatarModalVisible(false);
      message.success('Avatar updated successfully.');
    } catch (error) {
      message.error('Failed to update avatar.');
      console.error('Avatar update failed:', error);
    }
  };

  const handleAvatarModalCancel = () => {
    setIsAvatarModalVisible(false);
    setAvatarInput("");
  };

  if (loading) return <p>Loading...</p>;
  if (!userInfo) return <p>User data not found</p>;

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '800px',
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
    },
    avatar: {
      marginRight: '16px',
      border: '2px solid #1890ff',
      cursor: 'pointer',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333',
    },
    text: {
      fontSize: '14px',
      color: '#555',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Row justify="space-between" align="middle">
          <Col>
            <Row align="middle">
              <Avatar
                size={100}
                src={userInfo.avatar}
                icon={<UserOutlined />}
                style={styles.avatar}
                onClick={showAvatarModal}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {userInfo.name}
                </Title>
                <Text type="secondary">User ID: {userId}</Text>
                <div style={{ marginTop: '8px' }}>
                  <Tag color="green">Active</Tag>
                </div>
              </div>
            </Row>
          </Col>
          <Col>
            <UserRole userId={userId} />
          </Col>
        </Row>

        <Divider />

        <Form form={form} layout="vertical" style={{ marginTop: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span style={styles.label}>Full Name</span>}
                name="name"
                rules={[{required: true, message: 'Please enter your name' }]}
              >
                {isEditing ? (
                  <Input placeholder="Enter full name" />
                ) : (
                  <Text style={styles.text}>{userInfo.name}</Text>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={styles.label}>Email</span>} name="email">
                <Text style={styles.text}>{userInfo.email}</Text>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                label={<span style={styles.label}>Phone Number</span>}
                name="phone_number"
                rules={[
                  { required: true, message: 'Please enter your phone number' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'Phone number must contain only numeric characters',
                  },
                ]}
              >
                {isEditing ? (
                  <Input placeholder="Enter phone number" />
                ) : (
                  <Text style={styles.text}>{userInfo.phone_number}</Text>
                )}
            </Form.Item>

            </Col>
          </Row>
        </Form>

        <div style={styles.buttonGroup}>
          {isEditing ? (
            <>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </div>
      </Card>

      <Modal
        title="Change Avatar"
        visible={isAvatarModalVisible}
        onOk={handleAvatarUpdate}
        onCancel={handleAvatarModalCancel}
      >
        <Input
          placeholder="Enter image URL"
          value={avatarInput}
          onChange={(e) => setAvatarInput(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Account;

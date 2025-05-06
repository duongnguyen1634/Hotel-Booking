import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Row, Col, Radio, Space, Input, message, Layout } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Content } = Layout;

interface PaymentData {
  amount: number;
  original_amount: number;
  credit_card: string;
  deposit_type: string;
  discount: number;
}

const Payment: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/payment/?payment_id=${paymentId}`);
        setPaymentData(response.data.data);
        setLoading(false);
      } catch (error) {
        message.error('Failed to fetch payment details.');
        console.error(error);
        setLoading(false);
      }
    };
    fetchPaymentDetails();
  }, [paymentId]);

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const handleConfirmPayment = () => {
    navigate('/guest/booking/booking-success');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <Card style={{ marginBottom: '24px', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Title level={3} style={{ textAlign: 'center', fontWeight: 600 }}>Payment Details</Title>

            {paymentData ? (
              <>
                <Row gutter={[16, 24]}>
                  <Col span={12}>
                    <Text strong>Original Amount:</Text> <br />${paymentData.original_amount.toFixed(2)}
                  </Col>
                  <Col span={12}>
                    <Text strong>Discount:</Text> <br />{(paymentData.discount * 100).toFixed(0)}%
                  </Col>
                  <Col span={12}>
                    <Text strong>Amount to Pay:</Text> <br />${paymentData.amount.toFixed(2)}
                  </Col>
                  <Col span={12}>
                    <Text strong>Credit Card (last 4 digits):</Text> <br />**** {paymentData.credit_card}
                  </Col>
                  <Col span={12}>
                    <Text strong>Deposit Type:</Text> <br />{paymentData.deposit_type}
                  </Col>
                </Row>
              </>
            ) : (
              <p>No payment data available.</p>
            )}
          </Card>

          <Card bordered style={{ borderRadius: '8px', padding: '24px' }}>
            <Title level={4}>Select Payment Method</Title>
            <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod} style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio value="creditCard">Credit Card</Radio>
                <Radio value="paypal">Cash</Radio>
                <Radio value="bankTransfer">Bank Transfer</Radio>
              </Space>
            </Radio.Group>

            {paymentMethod === 'creditCard' && (
              <div style={{ marginTop: '16px' }}>
                <Input placeholder="Card Number" style={{ marginBottom: '8px' }} />
                <Row gutter={8}>
                  <Col span={12}>
                    <Input placeholder="Expiry Date (MM/YY)" />
                  </Col>
                  <Col span={12}>
                    <Input placeholder="CVC" />
                  </Col>
                </Row>
              </div>
            )}
          </Card>

          <Row justify="center" style={{ marginTop: '24px' }}>
            <Button type="primary" size="large" onClick={handleConfirmPayment} style={{ width: '100%', fontWeight: 600 }}>
              Confirm Payment
            </Button>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Payment;
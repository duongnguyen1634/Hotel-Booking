import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useAuth } from "./useAuth";
import { useNavigate  } from "react-router-dom";


interface LoginFormProps {
  someProp?: string;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();

  const onFinish = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);

    const res = await loginUser(email, password);
    if (res) {
      message.success("Login successful!");
      if (res.role === 'hotel_manager') {
        navigate('/hotel');
      } else if (res.role === 'guest') {
        navigate('/guest');
      }
    } else {
      message.error("Login failed. Please check your credentials.");
    }
    setIsLoading(false);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
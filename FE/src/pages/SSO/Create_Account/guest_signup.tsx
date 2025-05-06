import React from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const GuestSignup: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);

    try {
      const response = await fetch('http://localhost:8000/sso/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          phone_number: values.phone,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        alert(data.success);
        window.location.href = 'http://localhost:5173/';
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('An error occurred during registration.');
    }
  };



  return (
    <Form
      {...formItemLayout}
      form={form}
      name="guestregister"
      onFinish={onFinish}
      initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
        <Form.Item
        name="name"
        label="Name"
        tooltip="What do you want others to call you?"
        rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },{
            validator(_, value) {
              if (!value || value.length < 8) {
                return Promise.reject(new Error('Password must be at least 8 characters'));
              }
              return Promise.resolve();
            },
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input style={{ width: '100%' }} />
      </Form.Item>



      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GuestSignup;
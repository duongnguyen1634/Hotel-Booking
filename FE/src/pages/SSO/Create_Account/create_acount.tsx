import React from "react";
import { Button } from "antd";
const CreateAccount: React.FC = () => {
  return (
    <div>
      <Button href="signup/guest">Guest</Button>
      <Button href="signup/hotelmanager">Hotel Manger</Button>
      <Button href="signup/receptionist">Receptionist</Button>
    </div>
  );
};
export default CreateAccount;

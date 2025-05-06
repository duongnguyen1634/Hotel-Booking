import LoginForm from "./LoginForm";
import { User } from "../../../types";

interface LoginPageProps {
  someProps: React.Dispatch<React.SetStateAction<User | null>>;
}

const LogIn: React.FC<LoginPageProps> = () => {
  return <LoginForm />;
};

export default LogIn;

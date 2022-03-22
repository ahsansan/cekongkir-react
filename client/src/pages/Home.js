import BeforeLogin from "../components/BeforeLogin";
import Check from "../components/Check";
import { UserContext } from "../context/userContext";
import { useContext } from "react";

export default () => {
  const [state] = useContext(UserContext);
  return <div>{state.isLogin === true ? <Check /> : <BeforeLogin />}</div>;
};

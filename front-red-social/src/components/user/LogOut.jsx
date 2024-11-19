import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogOut = () => {
  const { setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    //Vaciar LocalStorage
    localStorage.clear();

    //Setear estados globales a vacío
    setAuth({});
    setCounters({});

    //Hacer navigate a login
    navigate("/login");
  });

  return <h1>Cerrando sesión...</h1>;
};

export default LogOut;

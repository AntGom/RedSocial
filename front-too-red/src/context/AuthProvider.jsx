import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Global } from "../helpers/Global";

const AuthContext = createContext();

// Crear el AuthProvider
export const AuthProvider = ({ children = null }) => {
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    //Sacar datos del user identificado del localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    //Comprobar si tengo el token y el user
    if (!token || !user) {
      setLoading(false);
      return false;
    }

    //transformar los datos a objeto javaScript
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    //Petición al back para comprobar token y que devuelva los datos del user
    const request = await fetch(Global.url + "user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    //Peticion para los contadores
    const requestCounters = await fetch(
      Global.url + "user/counters/" + userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const dataCounters = await requestCounters.json();

    //Setear el estado de Auth
    setAuth(data.user);
    setCounters(dataCounters);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        counters,
        setCounters,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Definir PropTypes para el AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default AuthContext;

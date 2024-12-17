/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import UserList from "../user/UserList";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";

const Following = () => {
  //Estados
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecto de carga
    setLoading(true);

    //Sacar userId de la url?
    const userId = params.userId;
    
    //-->Peticion para obtener los usuarios
    const request = await fetch(Global.url + "follow/following/"+ userId + "/"+ nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    let cleanUsers = [];
    //Recorrer y limpiar follows para quedarme con followed
    data.follows.forEach((follow) => {
      cleanUsers = [...cleanUsers, follow.followed];
    })
    data.users = cleanUsers;


    //-->Crear estado para poder listarlos
    if (data.users && data.status === "success") {
      
      let newUsers = data.users;

      if (users.length >= 1) {
        newUsers = [...users, ...data.users];
      }

      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);

      //-->Paginacion y fin btn "mostrar más"
      if (users.length >= data.total - data.users.length) {
        setMore(false);
      }
    }
  };

  return (
    <div className="max-w-7xl">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 text-start">Usuarios que sigue {userProfile.nick}</h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        more={more}
        loading={loading}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default Following;

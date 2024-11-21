/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import UserList from "../user/UserList";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";

const Followers = () => {
  //Estados
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, SetUserProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, SetUserProfile);
  }, []);

  const getUsers = async (nextPage = 1) => {
    // Efecto de carga
    setLoading(true);
  
    // Sacar userId de la URL
    const userId = params.userId;
  
    // Petición para obtener los seguidores
    const request = await fetch(Global.url + "follow/followers/" + userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
  
    const data = await request.json();
  
    if (data.status === "success" && data.follows) {
      // Procesar los usuarios que te siguen
      const cleanUsers = data.follows.map((follow) => follow.user);
      const newUsers = nextPage === 1 ? cleanUsers : [...users, ...cleanUsers];
  
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);
  
      // Verificar si hay más usuarios por cargar
      if (newUsers.length >= data.total) {
        setMore(false);
      }
    } else {
      setLoading(false);
      setMore(false);
    }
  };
  

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Seguidores de {userProfile.nick}</h1>
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
    </>
  );
};

export default Followers;

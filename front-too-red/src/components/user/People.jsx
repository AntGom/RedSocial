/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import UserList from "./UserList";

const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    setLoading(true);

    const request = await fetch(Global.url + "user/list/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.users && data.status === "success") {
      setUsers((prevUsers) => [...prevUsers, ...data.users]);
      setFollowing(data.user_following);
      setLoading(false);
      if (users.length >= data.total - data.users.length) setMore(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nick.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex-col">
      <h1 className="flex text-3xl font-bold text-gray-900 mb-4">
      Comunidad Too-Red
      </h1>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border-2 border-red-600 rounded-lg"
          placeholder="Buscar por nombre, nick o email."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de usuarios filtrada */}
      <UserList
        users={filteredUsers}
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

export default People;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Descubre personas
        </h1>
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

export default People;
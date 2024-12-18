import { NavLink } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { useAuth } from "../../hooks/UseAuth";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import useCounters from "../../hooks/useCounters.js";

const UserList = ({
  users,
  following,
  setFollowing,
  more,
  loading,
  page,
  setPage,
  getUsers,
}) => {
  const { auth } = useAuth();
  const { updateCounters } = useCounters();
  const token = localStorage.getItem("token");

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
  };

  const follow = async (userId) => {
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setFollowing([...following, userId]);
      updateCounters("following", 1);
    }
  };

  const unFollow = async (userId) => {
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setFollowing(following.filter((followId) => followId !== userId));
      updateCounters("following", -1);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Grid de usuarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <article
            key={user._id}
            className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 flex flex-col h-full"
          >
            {/* Contenido principal */}
            <div className="p-4">
              {/* Información del usuario */}
              <div className="flex items-center justify-between space-x-4">
                <NavLink to={`/social/profile/${user._id}`}>
                  <img
                    src={
                      user.image !== "default.png"
                        ? `${Global.url}user/avatar/${user.image}`
                        : avatar
                    }
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-full object-cover border border-red-900 transition-all duration-300 hover:scale-110"
                  />
                </NavLink>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">@{user.nick}</p>
                  <p className="text-xs text-gray-400">
                    <ReactTimeAgo
                      date={new Date(user.created_at).getTime()}
                      locale="es-ES"
                    />
                  </p>
                </div>
                {user._id !== auth._id && (
                  <button
                    onClick={() =>
                      following.includes(user._id)
                        ? unFollow(user._id)
                        : follow(user._id)
                    }
                    className={`min-w-8 p-2 rounded-full ${
                      following.includes(user._id)
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-300 text-gray-900 hover:bg-gray-400"
                    }`}
                  >
                    {following.includes(user._id) ? (
                      <UserMinusIcon className="w-5 h-5" />
                    ) : (
                      <UserPlusIcon className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
              <NavLink
                to={`/social/profile/${user._id}`}
                className="flex justify-center text-lg font-semibold text-gray-900 mt-2"
              >
                <p>
                  {user.name} {user.surname}
                </p>
              </NavLink>
            </div>
          </article>
        ))}
      </div>

      {/* Botón para cargar más */}
      {more && !loading && (
        <div className="flex justify-end mt-8 mb-8">
          <button
            onClick={nextPage}
            className="text-gray-900 font-bold border-2 border-red-600 p-2 rounded-lg hover:scale-105 transition-all"
          >
            Cargar más usuarios
          </button>
        </div>
      )}
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  following: PropTypes.array.isRequired,
  setFollowing: PropTypes.func.isRequired,
  more: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
};

export default UserList;

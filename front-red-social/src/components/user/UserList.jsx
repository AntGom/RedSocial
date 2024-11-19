import { NavLink } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/UseAuth";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";

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
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setFollowing([...following, userId]);
    }
  };

  const unFollow = async (userId) => {
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setFollowing(following.filter((followId) => followId !== userId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Grid de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <article
            key={user._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-4">
              {/* Información del usuario */}
              <div className="flex items-center space-x-4">
                <NavLink to={`/social/profile/${user._id}`}>
                  <img
                    src={
                      user.image !== "default.png"
                        ? `${Global.url}user/avatar/${user.image}`
                        : avatar
                    }
                    alt="Foto de perfil"
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                  />
                </NavLink>
                <div className="flex-1 min-w-0">
                  <NavLink
                    to={`/social/profile/${user._id}`}
                    className="text-base font-bold text-gray-900 hover:text-blue-500 truncate"
                  >
                    {user.name} {user.surname}
                  </NavLink>
                  <p className="text-sm text-gray-500">@{user.nick}</p>
                  <p className="text-xs text-gray-400">
                    <ReactTimeAgo
                      date={new Date(user.created_at).getTime()}
                      locale="es-ES"
                    />
                  </p>
                </div>
              </div>

              {/* Biografía */}
              <p className="mt-3 text-sm text-gray-700">
                {user.bio || "Sin biografía"}
              </p>

              {/* Botón de seguir */}
              {user._id !== auth._id && (
                <div className="mt-4">
                  <button
                    onClick={() =>
                      following.includes(user._id)
                        ? unFollow(user._id)
                        : follow(user._id)
                    }
                    className={`w-full py-2 px-4 rounded-full font-bold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      following.includes(user._id)
                        ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
                        : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400"
                    }`}
                  >
                    {following.includes(user._id)
                      ? "Dejar de seguir"
                      : "Seguir"}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Spinner de carga */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Botón para cargar más */}
      {more && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={nextPage}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
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

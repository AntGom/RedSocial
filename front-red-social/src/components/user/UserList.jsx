import { NavLink } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/UseAuth";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/solid";
import  useCounters from "../../hooks/useCounters.js";

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
      updateCounters("following", 1);
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
            <div className="p-4 flex-1 space-y-2">
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
                    className="w-16 h-16 rounded-full object-cover border-4 border-white transition-all duration-300 hover:scale-110 "
                  />
                </NavLink>

                <div>
                  <p className="text-sm text-gray-700">@{user.nick}</p>
                  <p className="text-xs text-gray-400">
                    <ReactTimeAgo
                      date={new Date(user.created_at).getTime()}
                      locale="es-ES"
                    />
                  </p>
                </div>
              </div>
              <NavLink
                to={`/social/profile/${user._id}`}
                className="flex flex-col items-center text-lg font-semibold text-gray-900 "
              >
                <p>{user.name}</p>
                <p>{user.surname}</p>
              </NavLink>
              {/* Biografía */}
              <p className="text-sm text-gray-700 line-clamp-2 italic">
                {user.bio || "Sin biografía"}
              </p>
            </div>

            {/* Botón de seguir */}
            {user._id !== auth._id && (
              <div className="flex justify-center items-center p-3">
                <button
                  onClick={() =>
                    following.includes(user._id)
                      ? unFollow(user._id)
                      : follow(user._id)
                  }
                  className={`min-w-28 px-2 py-2 font-semibold text-sm ${
                    following.includes(user._id)
                      ? "flex items-center justify-center bg-white border-2 text-red-600 border-gray-900  rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-38 h-10"
                      : "flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-38 h-10"
                  }`}
                >
                  {following.includes(user._id) ? (
                    <>
                      <UserMinusIcon className="w-5 h-5 mr-2 text-red-600" />
                      Dejar de seguir
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5 mr-2 " />
                      Seguir
                    </>
                  )}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Spinner de carga */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}

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

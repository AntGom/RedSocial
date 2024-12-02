import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";
import {
  WrenchScrewdriverIcon,
  UserPlusIcon,
  UserMinusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { NavLink, useNavigate } from "react-router-dom";

const ProfileActions = ({ user, auth, iFollow, setIFollow, token }) => {
  const navigate = useNavigate();

  //Seguir a un usuario
  const follow = async () => {
    if (!user._id) return;
    const request = await fetch(`${Global.url}follow/save`, {
      method: "POST",
      body: JSON.stringify({ followed: user._id }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();
    if (data.status === "success") {
      setIFollow(true);
    }
  };

  //Dejar de seguir a un usuario
  const unFollow = async () => {
    if (!user._id) return;
    const request = await fetch(`${Global.url}follow/unfollow/${user._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();
    if (data.status === "success") {
      setIFollow(false);
    }
  };

  //Eliminar el perfil
  const deleteProfile = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu perfil? Esta acción no se puede deshacer.")) {
      const request = await fetch(`${Global.url}user/delete/${auth._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
  
      const data = await request.json();
      if (data.message === "Usuario eliminado correctamente (soft delete)") {
        alert("Perfil eliminado correctamente.");
  
        // Borrar token y datos de usuario de localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
  
        // Redirigir a la página de login
        navigate("/social/logout");
      } else {
        alert("Error al eliminar el perfil.");
      }
    }
  };
  

  return (
    <section className="flex flex-col items-center gap-2 mr-8 mb-3">
      
      {user._id === auth._id ? (
        <>
          <NavLink to="/social/config">
            <button className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10">
              <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
              Editar perfil
            </button>
          </NavLink>
          <button
            onClick={deleteProfile}
            className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10"
          >
            <TrashIcon className="w-5 h-5 mr-2 text-red-600" />
            Borrar perfil
          </button>
        </>
      ) : (
        <button
          onClick={() => (iFollow ? unFollow() : follow())}
          className={`${
            iFollow
              ? "flex items-center justify-center bg-white border-2 text-red-600 border-gray-900 font-semibold rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-44 h-10"
              : "flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10"
          }`}
        >
          {iFollow ? (
            <>
              <UserMinusIcon className="w-5 h-5 mr-2 text-red-600" />
              Dejar de seguir
            </>
          ) : (
            <>
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Seguir
            </>
          )}
        </button>
      )}
    </section>
  );
};

ProfileActions.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  iFollow: PropTypes.bool,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default ProfileActions;

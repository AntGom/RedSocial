import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";
import {
  WrenchScrewdriverIcon,
  UserPlusIcon,
  UserMinusIcon,
  TrashIcon,
  ShieldExclamationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteProfileModal from "./DeleteprofileModal";
import Toast from "../../../helpers/Toast";

const ProfileActions = ({ user, auth, iFollow, setIFollow, token }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message, type) => {
    setToast({ message, type });
    setShowToast(true);
  };

  // Seguir
  const follow = async () => {
    if (!user._id) return;
    try {
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
        showToastMessage("¡Ahora sigues a este usuario!", "success");
      } else {
        showToastMessage(data.message || "Error al seguir al usuario", "error");
      }
    } catch (error) {
      showToastMessage(error.message ||"Error de conexión. Inténtalo más tarde.", "error");
    }
  };

  // Dejar de seguir
  const unFollow = async () => {
    if (!user._id) return;
    try {
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
        showToastMessage("Has dejado de seguir a este usuario.", "success");
      } else {
        showToastMessage(
          data.message || "Error al dejar de seguir al usuario",
          "error"
        );
      }
    } catch (error) {
      showToastMessage(error.message ||"Error de conexión. Inténtalo más tarde.", "error");
    }
  };

  // Banear usuario
  const banUser = async () => {
    if (!user._id) return;
    try {
      const request = await fetch(`${Global.url}user/ban/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();
      if (data.status === "success") {
        showToastMessage("Usuario baneado con éxito.", "success");
        // Actualizar el estado para reflejar el baneo
        user.isBanned = true;
      } else {
        showToastMessage(data.message || "Error al intentar banear al usuario", "error");
      }
    } catch (error) {
      showToastMessage(error.message ||"Error de conexión. Inténtalo más tarde.", "error");
    }
  };

  // Desbanear usuario
  const unbanUser = async () => {
    if (!user._id) return;
    try {
      const request = await fetch(`${Global.url}user/unban/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();
      if (data.status === "success") {
        showToastMessage("Usuario desbaneado con éxito.", "success");
        // Actualizar el estado para reflejar el desbaneo
        user.isBanned = false;
      } else {
        showToastMessage(data.message || "Error al intentar desbanear al usuario", "error");
      }
    } catch (error) {
      showToastMessage(error.message ||"Error de conexión. Inténtalo más tarde.", "error");
    }
  };

  // Éxito al eliminar perfil
  const handleDeleteSuccess = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/social/logout");
    showToastMessage("Perfil eliminado correctamente.", "success");
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
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10"
          >
            <TrashIcon className="w-5 h-5 mr-2 text-red-600" />
            Borrar perfil
          </button>

          {showDeleteModal && (
            <DeleteProfileModal
              authId={auth._id}
              token={token}
              onDeleteSuccess={handleDeleteSuccess}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
        </>
      ) : (
        <>
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

          {auth.role === "admin" && (
            <>
              <button
                onClick={user.isBanned ? unbanUser : banUser}
                className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10"
              >
                {user.isBanned ? (
                  <>
                    <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-600" />
                    Desbanear
                  </>
                ) : (
                  <>
                    <ShieldExclamationIcon className="w-5 h-5 mr-2 text-red-600" />
                    Banear
                  </>
                )}
              </button>
            </>
          )}
        </>
      )}

      {showToast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  );
};

ProfileActions.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isBanned: PropTypes.bool,
  }).isRequired,
  auth: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  iFollow: PropTypes.bool,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default ProfileActions;

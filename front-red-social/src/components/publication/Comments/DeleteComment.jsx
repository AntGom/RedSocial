import { TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";
import { useState, useEffect } from "react";

const DeleteComment = ({ publicationId, commentId, commentUserId, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Estado para verificar si el usuario es el propietario

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decodificar el token JWT para obtener los datos del usuario logueado
      try {
        const user = JSON.parse(atob(token.split('.')[1])); // Decodificamos el payload
        console.log("Usuario decodificado:", user); // Verifica el usuario del token

        // Compara el id del usuario logueado con el id del usuario que creó el comentario
        setIsOwner(user.id === commentUserId);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, [commentUserId]); // Se ejecuta cuando commentUserId cambia

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setModalMessage("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      const response = await fetch(
        `${Global.url}publication/${publicationId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "success") {
        onDelete(commentId);
        setShowModal(false);
      } else if (response.status === 403) {
        setModalMessage("No tienes permiso para eliminar este comentario.");
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error.message);
      setModalMessage("Hubo un error. Por favor, inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  if (!isOwner) {
    return null; // No mostrar el componente si el usuario no es el propietario del comentario
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
        title="Eliminar comentario"
        aria-label="Eliminar comentario"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      {showModal && (
        <div
          className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10"
          onClick={handleModalClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-700 font-semibold">
              ¿Estás seguro de querer eliminar este comentario?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className={`p-2 text-gray-900 font-medium rounded-lg border-2 ${
                  loading
                    ? "border-gray-400 bg-gray-400 cursor-not-allowed"
                    : "border-red-600 hover:scale-105"
                } transition-all duration-200`}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border-2 hover:scale-110 transition-all duration-300 text-gray-900 rounded-xl"
              >
                <XCircleIcon className="w-6 h-6 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {modalMessage && (
        <div
          className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-20"
          onClick={() => setModalMessage("")}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-900 font-semibold">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 border-2 hover:scale-110 transition-all duration-300 text-gray-900 rounded-xl"
            >
              <XCircleIcon className="w-6 h-6 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

DeleteComment.propTypes = {
  publicationId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  commentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteComment;

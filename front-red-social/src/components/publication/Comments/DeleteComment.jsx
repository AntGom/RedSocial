import { TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";
import { useState } from "react";

const DeleteComment = ({ publicationId, commentId, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${Global.url}publication/${publicationId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        onDelete(commentId);
        setShowModal(false);
      } else {
        alert("No se pudo eliminar el comentario.");
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
        title="Eliminar comentario"
      >
        <TrashIcon className="h-5 w-5" />
      </button>

      {showModal && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-700 font-semibold">
              ¿Estás seguro de querer eliminar este comentario?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleDelete}
                className={`p-2 text-gray-900 font-medium rounded-lg border-2 border-red-600 hover:scale-105 transition-all duration-200 ${
                  loading ? "bg-gray-400" : ""
                }`}
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
    </>
  );
};

DeleteComment.propTypes = {
  publicationId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteComment;
import PropTypes from "prop-types";
import { useState } from "react";
import { Global } from "../../helpers/Global";

const DeletePublication = ({ publicationId, onDeleteSuccess, onCancel }) => {
  const token = localStorage.getItem("token") || "";
  const [loading, setLoading] = useState(false);

  const deletePublication = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${Global.url}publication/remove/${publicationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        onDeleteSuccess();
      } else {
        console.error("Error al eliminar la publicación:", data.message);
      }
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center rounded-3xl justify-center z-10">
      <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
        <p className="text-gray-700 font-semibold">
          ¿Estás seguro de que deseas eliminar esta publicación?
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={deletePublication}
            className={`px-4 py-2 text-white rounded-3xl ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-blue-400 text-white rounded-3xl hover:bg-blue-500"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

DeletePublication.propTypes = {
  publicationId: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeletePublication;

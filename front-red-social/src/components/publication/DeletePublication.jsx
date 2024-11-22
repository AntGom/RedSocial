import PropTypes from "prop-types";
import { useState } from "react";
import { Global } from "../../helpers/Global";
import { XCircleIcon } from "@heroicons/react/24/solid";

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
    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center rounded-lg justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-700 font-semibold">
          ¿Estás seguro de que deseas eliminar esta publicación?
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={deletePublication}
            className={`p-2 text-gray-900 font-medium rounded-lg border-2 border-red-600 hover:scale-105 transition-all duration-200 ${
              loading ? "bg-gray-400" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border-2  hover:scale-110 transition-all duration-300 text-gray-900 rounded-xl"
          >
            <XCircleIcon className="w-6 h-6 text-red-500" />
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

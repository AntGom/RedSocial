import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { Global } from "../../helpers/Global";
import NotificationMessage from "./NewPublication/NotificationMessage";
import Modal from "./NewPublication/ModalNewPublication";
import { CountersContext } from "../../context/CountersContext";

const DeletePublication = ({ publicationId, onDeleteSuccess, onCancel }) => {
  const [status, setStatus] = useState("not_stored");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token")?.replace(/['"]/g, "");
  
  const { updateCounters } = useContext(CountersContext);

  const deletePublication = async () => {
    setLoading(true);
    setStatus("not_stored");
    try {
      const response = await fetch(
        `${Global.url}publication/remove/${publicationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        setStatus("stored");
        updateCounters("publications", -1);

        setTimeout(() => {
          onDeleteSuccess();
        }, 1000);
      } else {
        setStatus("error");
        console.error("Error al eliminar la publicación:", data.message);
      }
    } catch (error) {
      setStatus("error");
      console.error("Error al eliminar la publicación:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Token decodificado:", JSON.parse(atob(token.split('.')[1])));

  return (
    <Modal isOpen={true} onClose={onCancel} title="Eliminar publicación">
      <NotificationMessage
        status={status}
        setStatus={setStatus}
        successMessage="¡Publicación eliminada con éxito!"
        errorMessage="Error al eliminar la publicación."
      />
      <p className="text-gray-700 font-semibold text-center">
        ¿Estás seguro de que deseas eliminar esta publicación?
      </p>

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={deletePublication}
          className={`px-4 py-2 text-white font-medium rounded-lg bg-red-600 hover:bg-red-700 transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
};

DeletePublication.propTypes = {
  publicationId: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeletePublication;

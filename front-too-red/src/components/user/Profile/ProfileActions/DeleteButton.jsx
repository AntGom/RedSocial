import PropTypes from "prop-types";
import { useState } from "react";
import { Global } from "../../../../helpers/Global";
import Modal from "../../../publication/NewPublication/ModalNewPublication";
import NotificationMessage from "../../../publication/NewPublication/NotificationMessage";

const DeleteProfileModal = ({ authId, token, onDeleteSuccess, onCancel }) => {
  const [status, setStatus] = useState("not_stored");
  const [loading, setLoading] = useState(false);

  const deleteProfile = async () => {
    setLoading(true);
    setStatus("not_stored");

    try {
      const response = await fetch(`${Global.url}user/delete/${authId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();

      if (data.message === "Usuario eliminado correctamente (soft delete)") {
        setStatus("stored");

        setTimeout(() => {
          onDeleteSuccess();
        }, 1000);
      } else {
        setStatus("error");
        console.error("Error al eliminar el perfil:", data.message);
      }
    } catch (error) {
      setStatus("error");
      console.error("Error al eliminar el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel} title="Eliminar perfil">
      <NotificationMessage
        status={status}
        setStatus={setStatus}
        successMessage="¡Perfil eliminado con éxito!"
        errorMessage="Error al eliminar el perfil."
      />
      <p className="text-gray-700 font-semibold text-start">
        ¿Estás seguro de que deseas{" "}
        <span className="text-red-500">eliminar tu perfil</span>?
      </p>
      <p className="text-gray-700 font-medium text-start">
        Tienes <span className="font-semibold">30 días</span> para cancelar esta
        acción. Después de este período, tu cuenta será{" "}
        <span className="text-red-500">eliminada de forma permanente</span>.
      </p>

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={deleteProfile}
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

DeleteProfileModal.propTypes = {
  authId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteProfileModal;

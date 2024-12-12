import { useState } from "react";
import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global.jsx";
import Toast from "../../../helpers/Toast.jsx";

const ReportPublication = ({ publicationId, onClose }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const reportReasons = [
    "Contenido inapropiado",
    "Lenguaje ofensivo",
    "Spam",
    "Acoso o discurso de odio",
    "Falsedad o engaño",
    "Otro"
  ];

  const onReport = async () => {
    if (!selectedReason) {
      alert("Por favor, selecciona una razón para reportar.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Global.url}publication/report/${publicationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ reason: selectedReason }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setToast({
          message: "Reporte enviado con éxito",
          type: "success",
          show: true,
        });
      } else {
        setToast({
          message: `Error al reportar la publicación: ${data.message}`,
          type: "error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Error al reportar la publicación:", error);
      setToast({
        message: "Error al intentar reportar la publicación.",
        type: "error",
        show: true,
      });
    }
  };

  const closeToastAndModal = () => {
    setToast({ ...toast, show: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-96">
        <h2 className="text-lg font-bold mb-4">Denunciar Publicación</h2>
        <label className="block mb-2 text-sm font-medium">Motivo:</label>
        <select
          className="block w-full p-2 border rounded mb-4"
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          {reportReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onReport}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reportar
          </button>
        </div>
      </div>

      {/* Mostrar Toast si show=true */}
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToastAndModal} />
      )}
    </div>
  );
};

ReportPublication.propTypes = {
    publicationId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default ReportPublication;


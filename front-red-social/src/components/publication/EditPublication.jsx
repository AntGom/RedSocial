import PropTypes from "prop-types";
import { useState } from "react";
import { Global } from "../../helpers/Global";

const EditPublication = ({ publication, onSave, onCancel }) => {
  const [editText, setEditText] = useState(publication.text);
  const token = localStorage.getItem("token") || "";

  const saveEdit = async () => {
    if (!editText.trim()) {
      alert("El texto no puede estar vacío");
      return;
    }

    try {
      const response = await fetch(`${Global.url}publication/edit/${publication._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ text: editText }),
      });

      const data = await response.json();

      if (data.status === "success") {
        onSave(); // Notifica al padre que la edición se hizo
      } else {
        console.error("Error al actualizar la publicación:", data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud de edición:", error);
    }
  };

  return (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex flex-col gap-2 items-center rounded-2xl justify-center z-10 ">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        className="bg-white p-6 rounded-xl shadow-lg text-start w-3/5"
      />
      <div className="bg-white p-3 rounded-xl shadow-lg text-center w-1/4 ">
              <p className="text-gray-900 font-semibold">
          ¿Guardar cambios??
        </p>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={saveEdit}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-3xl"
        >
          Aceptar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-blue-400 text-white rounded-3xl hover:bg-blue-500"
        >
          Cancelar
        </button>
      </div>
      </div>

    </div>
  );
};

EditPublication.propTypes = {
  publication: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditPublication;

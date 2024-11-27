import { useState, useRef } from "react";
import { Global } from "../../../helpers/Global";
import useForm from "../../../hooks/UseForm";
import useAuth from "../../../hooks/UseAuth";
import { FolderPlusIcon } from "@heroicons/react/24/solid";
import Modal from "./ModalNewPublication";

import NotificationMessage from "./NotificationMessage";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [showForm, setShowForm] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
    setSelectedFileName("");
  };

  const savePublication = async (e) => {
    e.preventDefault();
    if (!form.text?.trim()) {
      setStored("error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setStored("error");
      console.error("Error: No se encontró un token en el localStorage.");
      return;
    }

    try {
      const newPublication = { ...form, user: auth._id };

      const request = await fetch(Global.url + "publication/save/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(newPublication),
      });

      const data = await request.json();
      setStored(data.status === "success" ? "stored" : "error");

      if (data.status === "success" && fileInputRef.current.files[0]) {
        const formData = new FormData();
        formData.append("file0", fileInputRef.current.files[0]);

        const uploadRequest = await fetch(
          Global.url + "publication/upload/" + data.publicationStored._id,
          {
            method: "POST",
            body: formData,
            headers: { Authorization: token },
          }
        );

        const uploadData = await uploadRequest.json();
        setStored(uploadData.status === "success" ? "stored" : "error");
      }

      resetForm();

      // Añadir un setTimeout para cerrar el modal después de 3 segundos
      setTimeout(() => {
        setShowForm(false);
      }, 3000); // 3000 milisegundos = 3 segundos
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      setStored("error");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : "");
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="w-4/5 text-gray-900 font-bold text-xl rounded-lg hover:bg-gray-200 p-2 -mb-2 transition-all duration-300 hover:scale-110 text-left"
      >
        Publicar
      </button>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva publicación"
      >
        <NotificationMessage
          status={stored}
          setStatus={setStored}
          successMessage="Publicación realizada con éxito"
          errorMessage="Error al realizar la publicación"
        />

        <form ref={formRef} onSubmit={savePublication} className="space-y-4">
          <textarea
            name="text"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none min-h-[120px]"
            placeholder="¿Qué estás pensando?"
            onChange={changed}
          />

          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <label
                htmlFor="fileInput"
                className="flex items-center p-2 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <FolderPlusIcon className="h-6 w-6 text-gray-700" />
                <span className="ml-2 text-gray-700">Añadir archivo</span>
              </label>
              <input
                id="fileInput"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFileName && (
                <span className="text-sm text-gray-600">
                  {selectedFileName}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="p-2 text-gray-900 font-medium rounded-lg border-2 border-red-600 hover:scale-105 transition-all duration-200"
            >
              Publicar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default NewPublicationForm;

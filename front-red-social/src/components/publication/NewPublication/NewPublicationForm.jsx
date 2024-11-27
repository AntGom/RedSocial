import { useState, useRef, useEffect } from "react";
import { Global } from "../../../helpers/Global";
import useForm from "../../../hooks/UseForm";
import useAuth from "../../../hooks/UseAuth";
import Modal from "./ModalNewPublication";
import NotificationMessage from "./NotificationMessage";
import FileInput from "./FileInput";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const formRef = useRef(null);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
    setSelectedFile(null);
  };

  const savePublication = async (e) => {
    e.preventDefault();
    if (!form.text?.trim()) {
      setStored("error");
      return;
    }

    const token = localStorage.getItem("token");

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

      if (data.status === "success" && selectedFile) {
        const formData = new FormData();
        formData.append("file0", selectedFile);

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

      // Cerrar el modal después de 1.5 segundos
      setTimeout(() => {
        setShowForm(false);
      }, 1500);
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      setStored("error");
    }
  };

  // Ocultar el mensaje de éxito/error después de 1.5 segundos
  useEffect(() => {
    if (stored === "stored" || stored === "error") {
      const timer = setTimeout(() => {
        setStored("not_stored"); 
      }, 1500);
      return () => clearTimeout(timer); // Limpiar temporizador al desmontar
    }
  }, [stored]);

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
            <FileInput onFileSelect={setSelectedFile} />
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

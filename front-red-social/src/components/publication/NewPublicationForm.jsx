import { useState, useRef, useEffect } from "react";
import { Global } from "../../helpers/Global";
import useForm from "../../hooks/UseForm";
import useAuth from "../../hooks/UseAuth";
import Modal from "./ModalNewPublication";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const resetForm = () => {
    if (formRef.current) formRef.current.reset();
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
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      setStored("error");
    }
  };

  useEffect(() => {
    if (stored !== "not_stored") {
      const timer = setTimeout(() => setStored("not_stored"), 3000);
      return () => clearTimeout(timer);
    }
  }, [stored]);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="w-4/5 text-gray-900 font-bold text-xl rounded-lg hover:bg-gray-200 hover:p-2 transition-all duration-300 hover:scale-105 text-left ml-8"
      >
        Publicar
      </button>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nueva publicación"
      >
        {stored !== "not_stored" && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              stored === "stored"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <p className="text-sm text-center font-medium">
              {stored === "stored"
                ? "Publicación realizada con éxito"
                : "Error al realizar la publicación"}
            </p>
          </div>
        )}

        <form ref={formRef} onSubmit={savePublication} className="space-y-4">
          <textarea
            name="text"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[120px]"
            placeholder="¿Qué estás pensando?"
            onChange={changed}
          />

          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

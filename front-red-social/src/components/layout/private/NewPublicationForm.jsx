import { useState, useRef, useEffect } from "react";
import { Global } from "../../../helpers/Global";
import useForm from "../../../hooks/useForm";
import useAuth from "../../../hooks/UseAuth";

const NewPublicationForm = () => {
  const { auth } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar formulario
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

    try {
      const newPublication = { ...form, user: auth._id };
      const token = localStorage.getItem("token");

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
      setShowForm(false); // Ocultar formulario tras guardar
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
    <div className="flex w-full">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-4/5 text-gray-900 font-bold text-xl rounded-lg hover:bg-gray-200 hover:p-2 transition-all duration-300 hover:scale-105 text-left ml-8"
        >
          Publicar
        </button>
      ) : (
        <>
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Nueva publicación
          </h2>
          {stored !== "not_stored" && (
            <div
              className={`p-3 rounded-lg mb-3 ${
                stored === "stored"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <p className="text-sm text-center">
                {stored === "stored"
                  ? "Publicación realizada con éxito"
                  : "Error al realizar la publicación"}
              </p>
            </div>
          )}
          <form ref={formRef} onSubmit={savePublication} className="space-y-4">
            <textarea
              name="text"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="¿Qué estás pensando?"
              rows="4"
              onChange={changed}
            ></textarea>
            <div className="space-y-3">
              <input
                type="file"
                ref={fileInputRef}
                className="w-full text-sm text-gray-500 file:mr-1 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-3xl hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Publicar
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default NewPublicationForm;

import { NavLink } from "react-router-dom";
import avatar from "../../../assets/img/user.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import useForm from "../../../hooks/useForm";
import { useState, useRef, useEffect } from "react";

const Sidebar = () => {
  const { auth, counters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
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
    <aside className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg">
      <div className="flex flex-col h-full p-6 space-y-6">
        {/* Perfil */}
        <div className="flex items-center space-x-4">
          <img
            src={
              auth.image !== "default.png"
                ? `${Global.url}user/avatar/${auth.image}`
                : avatar
            }
            alt="Foto de Perfil"
            className="w-12 h-12 rounded-full object-cover border border-blue-500"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {auth.name}
            </h1>
            <p className="text-sm text-gray-500">@{auth.nick}</p>
          </div>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Siguiendo", count: counters.following },
            { label: "Seguidores", count: counters.followers },
            { label: "Publicaciones", count: counters.publications },
          ].map(({ label, count }) => (
            <NavLink
              to={`/social/${label.toLowerCase()}/${auth._id}`}
              key={label}
              className="flex flex-col items-center p-2 "
            >
              <span className="text-xs font-medium text-gray-600 hover:text-yellow-400 transition">{label}</span>
              <span className="text-lg font-semibold text-blue-600 ">
                {count || 0}
              </span>
            </NavLink>
          ))}
        </div>

        {/* Formulario */}
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-800 mb-3">
            Nueva publicación
          </h2>
          {stored !== "not_stored" && (
            <div className={`p-3 rounded-lg mb-3 ${
              stored === "stored"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}>
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
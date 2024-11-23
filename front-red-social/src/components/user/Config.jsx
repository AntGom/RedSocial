import { useState } from "react";
import useAuth from "../../hooks/UseAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import SerializeForm from "../../helpers/SerializeForm";
import {
  EyeIcon,
  EyeSlashIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/solid";

const Config = () => {
  const { auth, setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let newDataUser = SerializeForm(e.target);
    delete newDataUser.file0;

    try {
      const request = await fetch(Global.url + "user/update", {
        method: "PUT",
        body: JSON.stringify(newDataUser),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await request.json();
      handleResponse(data);

      const fileInput = document.querySelector("#file");
      if (data.status === "success" && fileInput.files[0]) {
        await uploadImage(fileInput.files[0], token);
      }
    } catch (error) {
      setSaved("error");
      console.error(error);
    }
  };

  const handleResponse = (data) => {
    if (data.status === "success") {
      delete data.user.password;
      setAuth(data.user);
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };

  const uploadImage = async (file, token) => {
    const formData = new FormData();
    formData.append("file0", file);

    const uploadRequest = await fetch(Global.url + "user/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: token,
      },
    });

    const uploadData = await uploadRequest.json();
    handleResponse(uploadData);
  };

  return (
    <>
      
        <h1 className="text-3xl font-bold text-gray-900 text-start">
          Editar Perfil
        </h1>

      <section className="max-w-3xl mx-auto p-6 bg-gray-100 border-2 rounded-lg mt-4 mb-8">
        <form onSubmit={updateUser}>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Nombre
              </label>
              <input
                type="text"
                name="name"
                defaultValue={auth.name}
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-gray-900"
              >
                Apellidos
              </label>
              <input
                type="text"
                name="surname"
                defaultValue={auth.surname}
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="nick"
                className="block text-sm font-medium text-gray-900"
              >
                Nickname
              </label>
              <input
                type="text"
                name="nick"
                defaultValue={auth.nick}
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-900"
              >
                Biografía
              </label>
              <textarea
                name="bio"
                defaultValue={auth.bio}
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={auth.email}
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-6 h-6 text-gray-700" />
                  ) : (
                    <EyeIcon className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="file0"
                className="block text-sm font-medium text-gray-900"
              >
                Avatar
              </label>
              <div className="flex items-center mt-2 space-x-4">
                <img
                  src={
                    auth.image !== "default.png"
                      ? Global.url + "user/avatar/" + auth.image
                      : avatar
                  }
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-2 border-gray-700"
                />
                {/* Botón para seleccionar archivo */}
                <label
                  htmlFor="fileInput"
                  className="flex items-center p-2 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <FolderOpenIcon className="h-6 w-6 text-gray-700" />
                  <span className="ml-2 text-gray-700">Seleccionar imagen</span>
                </label>
                <input id="fileInput" type="file" className="hidden" />
              </div>
            </div>
          </div>
          {saved === "saved" && (
            <div className="p-4 mb-6 text-md font-bold text-green-700 bg-yellow-300 rounded-3xl text-center mx-auto w-1/2">
              ¡¡Usuario actualizado correctamente!!
            </div>
          )}

          {saved === "error" && (
            <div className="p-4 mb-6 text-sm font-bold text-red-700 bg-red-300 rounded-3xl text-center mx-auto w-1/2">
              Error al actualizar los datos de usuario
            </div>
          )}

          <div className="flex justify-center">
          <button
              type="submit"
              className="p-2 text-gray-900 font-medium rounded-lg border-2 border-red-600 hover:scale-105 transition-all duration-300"
            >
              Actualizar
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Config;

import { useState } from "react";
import useAuth from "../../hooks/UseAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import SerializeForm from "../../helpers/SerializeForm";

const Config = () => {
  const { auth, setAuth } = useAuth();
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
      console.error(error); // Log para depuración
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Configuración
        </h1>
      </section>

      <section className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-3xl mt-6">
        <form className="space-y-6" onSubmit={updateUser}>
          <div className="space-y-4">
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
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
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
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
                <input
                  type="file"
                  name="file0"
                  id="file"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-100"
                />
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
              className="w-1/4 py-2 px-4  bg-blue-600 text-white font-medium rounded-3xl hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

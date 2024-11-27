import { useState } from "react";
import PropTypes from "prop-types";
import { Global } from "../../../helpers/Global";
import avatar from "../../../assets/img/user.png";
import { EyeIcon, EyeSlashIcon, FolderOpenIcon } from "@heroicons/react/24/solid";

const ProfileForm = ({ auth, showPassword, setShowPassword, onChange, onFileChange }) => {
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : ""); // Actualiza el nombre del archivo seleccionado
    onFileChange(e); // Llama a la función onFileChange pasada como prop para manejar la lógica adicional
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-gray-100 border-2 rounded-lg mt-4 mb-8">
      <form onSubmit={onChange}>
        <div className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
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
            <label htmlFor="surname" className="block text-sm font-medium text-gray-900">
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
            <label htmlFor="nick" className="block text-sm font-medium text-gray-900">
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
            <label htmlFor="bio" className="block text-sm font-medium text-gray-900">
              Biografía
            </label>
            <textarea
              name="bio"
              defaultValue={auth.bio}
              className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
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
            <label htmlFor="file0" className="block text-sm font-medium text-gray-900">
              Avatar
            </label>
            <div className="flex items-center mt-2 space-x-4">
              <img
                src={auth.image !== "default.png" ? `${Global.url}user/avatar/${auth.image}` : avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full border-2 bg-gray-300 border-gray-700 object-contain"
              />
              <label
                htmlFor="fileInput"
                className="flex items-center p-2 border border-gray-800 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <FolderOpenIcon className="h-6 w-6 text-gray-700" />
                <span className="ml-2 text-gray-700">Seleccionar imagen</span>
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange} // Maneja el cambio de archivo
              />
              {selectedFileName && (
                <span className="text-sm text-gray-700">{selectedFileName}</span> // Muestra el nombre del archivo
              )}
            </div>
          </div>
        </div>

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
  );
};

ProfileForm.propTypes = {
  auth: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string,
    nick: PropTypes.string,
    bio: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
};

export default ProfileForm;

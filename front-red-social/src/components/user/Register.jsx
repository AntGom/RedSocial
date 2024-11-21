import { useState } from "react";
import { Global } from "../../helpers/Global";
import UseForm from "../../hooks/UseForm";

const Register = () => {
  // Hook personalizado para manejar el formulario
  const { form, changed } = UseForm({});
  // Estado para manejar el estado de la solicitud de registro
  const [saved, setSaved] = useState("not_sended");

  // Función para manejar el envío del formulario
  const saveUser = async (e) => {
    e.preventDefault(); 
    let newUser = form; 

    // Realizar la solicitud 
    const request = await fetch(Global.url + "user/register", {
      method: "POST", 
      body: JSON.stringify(newUser), 
      headers: {
        "Content-Type": "application/json", 
      },
    });

    const data = await request.json(); 

    // Manejar la respuesta del servidor
    if (data.status === "success") {
      setSaved("login"); 
    }else{
      setSaved("error"); 
    }
  };

  return (
    <>
      <header className=" p-4 text-gray-900 text-center mt-2 w-full">
        <h1 className="text-2xl font-bold">Registro</h1>
      </header>

    <div className="flex justify-center items-center h-2/5">

    {saved === "saved" ? (
      <strong className="text-green-500">¡¡Usuario registrado correctamente!!</strong>
    ) : (
      ""
    )}

    {saved === "error" ? (
      <strong className="text-red-500">Error al registrar el usuario</strong>
    ) : (
      ""
    )}

    <form className="bg-white border-2 border-gray-900 p-6 rounded-xl shadow-lg shadow-gray-600 w-2/5" onSubmit={saveUser}>
      <div className="mb-2">
        <label htmlFor="name" className="block text-gray-900 font-semibold">Nombre</label>
        <input type="text" name="name" onChange={changed} value={form.name} className="border-2 border-red-600 rounded w-full py-2 px-3" />
      </div>

      <div className="mb-2">
        <label htmlFor="surname" className="block text-gray-900 font-semibold">Apellidos</label>
        <input type="text" name="surname" onChange={changed} className="border-2 border-red-600 rounded w-full py-2 px-3" />
      </div>

      <div className="mb-2">
        <label htmlFor="nick" className="block text-gray-900 font-semibold">Nickname</label>
        <input type="text" name="nick" onChange={changed} className="border-2 border-red-600 rounded w-full py-2 px-3" />
      </div>

      <div className="mb-2">
        <label htmlFor="email" className="block text-gray-900 font-semibold">Email</label>
        <input type="email" name="email" onChange={changed} className="border-2 border-red-600 rounded w-full py-2 px-3" />
      </div>

      <div className="mb-2">
        <label htmlFor="password" className="block text-gray-900 font-semibold">Contraseña</label>
        <input type="password" name="password" onChange={changed} className="border-2 border-red-600 rounded w-full py-2 px-3" />
      </div>

      <input type="submit" value="Regístrate" className="text-gray-900 border-2 font-semibold border-red-600 rounded py-2 px-4 hover:scale-110 transition-all duration-300" />
    </form>
    </div>
  </>
);
};
export default Register;

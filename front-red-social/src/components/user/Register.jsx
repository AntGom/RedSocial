import { useState } from "react";
import { Global } from "../../helpers/Global";
import UseForm from "../../hooks/useForm";

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
      <header className=" p-4 text-cyan-800 text-center mt-2 w-full">
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

    <form className="bg-cyan-800 p-6 rounded-3xl shadow-lg shadow-blue-600 w-2/5" onSubmit={saveUser}>
      <div className="mb-2">
        <label htmlFor="name" className="block text-white">Nombre</label>
        <input type="text" name="name" onChange={changed} value={form.name} className="mt-1 block w-full border border-gray-300 rounded p-2" />
      </div>

      <div className="mb-2">
        <label htmlFor="surname" className="block text-white">Apellidos</label>
        <input type="text" name="surname" onChange={changed} className="mt-1 block w-full border border-gray-300 rounded p-2 " />
      </div>

      <div className="mb-2">
        <label htmlFor="nick" className="block text-white">Nickname</label>
        <input type="text" name="nick" onChange={changed} className="mt-1 block w-full border border-gray-300 rounded p-2" />
      </div>

      <div className="mb-2">
        <label htmlFor="email" className="block text-white">Email</label>
        <input type="email" name="email" onChange={changed} className="mt-1 block w-full border border-gray-300 rounded p-2" />
      </div>

      <div className="mb-2">
        <label htmlFor="password" className="block text-white">Contraseña</label>
        <input type="password" name="password" onChange={changed} className="mt-1 block w-full border border-gray-300 rounded p-2" />
      </div>

      <input type="submit" value="Regístrate" className="w-full bg-blue-500 text-white font-bold py-2 mt-2 rounded hover:bg-blue-600" />
    </form>
    </div>
  </>
);
};
export default Register;

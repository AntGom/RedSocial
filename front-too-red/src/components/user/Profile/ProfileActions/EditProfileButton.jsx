import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

const EditProfileButton = () => {
  return (
    <NavLink to="/social/config">
      <button className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10">
        <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
        Editar perfil
      </button>
    </NavLink>
  );
};

export default EditProfileButton;

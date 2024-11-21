import { NavLink } from "react-router-dom";

const NavbarPublic = () => {
  return (
    <nav className=" p-2 flex justify-around border-2 border-red-600 shadow-md">
      <NavLink to="/social/feed" className="p-4 ">
        <img
          src="/logoRedCorto.webp"
          alt="Logo de la Red Social"
          className="w-16 h-16 rounded-xl border-2 border-red-900 hover:scale-110 hover:border-orange-500 transition-all duration-300"
        />
      </NavLink>

      <ul className="flex gap-4 items-center ">
        <li className=" hover:scale-110 transition-all duration-300">
          <NavLink to="/login"
            className="text-gray-900 font-bold border-2 border-red-600 rounded-lg p-2">
            <span>Login</span>
          </NavLink>
        </li>
        <li className=" hover:scale-110 transition-all duration-300">
          <NavLink to="/register"
            className="text-wgray-900  font-bold  border-2 border-red-600 rounded-lg p-2">
            <span>Registro</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarPublic;

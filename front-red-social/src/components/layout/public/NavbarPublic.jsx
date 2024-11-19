import { NavLink } from "react-router-dom";

const NavbarPublic = () => {
  return (
    <nav className="bg-cyan-800 p-4 flex justify-between">
      <header className="  p-2 rounded-md shadow-md ">
        <a href="/#" className=" text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2">
          ErFEISBUC
        </a>
      </header>

      <ul className="flex gap-2 items-center ">
        <li>
          <NavLink to="/login"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2">
            <span>Login</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/register"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2">            
            <span>Registro</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarPublic;

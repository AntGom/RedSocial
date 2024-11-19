import avatar from "../../../assets/img/user.png";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Global } from "../../../helpers/Global";

const Nav = () => {
  const { auth } = useAuth();

  return (
    <nav className="bg-cyan-800 p-4 flex justify-between items-center fixed top-0 w-full z-10 ">
      <div className="flex justify-start gap-2">
      <header className="h-4/5 p-2 rounded-md shadow-md ">
        <a
          href="/#"
          className=" text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2">
          ErFEISBUC
        </a>
      </header>
      <ul className="flex gap-2 items-center ">
        <li>
          <NavLink
            to="/social"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2"
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/social/feed"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2"
          >
            Timeline
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/social/people"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2"
          >
            Gente
          </NavLink>
        </li>
      </ul>
      </div>

      <ul className="flex gap-2 items-center ">
        <li>
          <NavLink to={"/social/profile/" + auth._id}>
            {auth.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + auth.image}
                alt="Foto de Perfil"
                className="border-2 border-white rounded-full w-10 h-10 "
              />
            )}
            {auth.image == "default.png" && (
              <img
                src={avatar}
                alt="Foto de Perfil"
                className="list-end__img"
              />
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/social/profile/" + auth._id}
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2"
          >
            {auth.nick}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/social/config"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2"
          >
            Ajustes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/social/logout"
            className="text-white font-bold hover:text-yellow-400 border-2 border-white rounded-lg p-2"
          >
            Cerrar Sesión
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;

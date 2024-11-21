import { CogIcon } from "@heroicons/react/24/outline";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import avatar from "../../../assets/img/user.png";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import UserCounters from "./UserCounters";

const Nav = () => {
  const { auth } = useAuth();

  return (
    <nav className="bg-white h-full w-1/5 fixed flex flex-col ">
      <section className=" flex">
        <article className="flex flex-col gap-3 items-center justify-center">
          <NavLink
            to="/social/feed"
            className="text-gray-900 font-bold hover:text-yellow-400 p-6"
          >
            <img
              src="../../../../public/logoRedCorto.webp"
              alt="Logo de la Red Social"
              className="w-20 h-20 rounded-xl border-2 border-red-900 hover:scale-110 hover:border-yellow-400 transition-all duration-300"
            />
          </NavLink>

          <div className="flex flex-row gap-4 justify-start">
            <NavLink to={"/social/profile/" + auth._id}>
              {auth.image !== "default.png" ? (
                <img
                  src={Global.url + "user/avatar/" + auth.image}
                  alt="Foto de Perfil"
                  className="border-4 border-red-600 rounded-lg  w-24 h-24 transition-all duration-300 hover:scale-110 hover:border-orange-600"
                />
              ) : (
                <img
                  src={avatar}
                  alt="Foto de Perfil"
                  className="border-2 border-gray-900 rounded-lg w-10 h-10 "
                />
              )}
            </NavLink>

            <div className=" flex flex-col items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {auth.name}
              </h1>
              <p className="text-md text-gray-700">@{auth.nick}</p>
            </div>
          </div>

          <div>
            <NavLink
              to="/social/people"
              className="font-bold text-xl hover:text-yellow-400 h-12 w-28 flex items-center justify-center gap-2"
            >
              <UserGroupIcon className="h-6 w-6" />
              Gente
            </NavLink>
          </div>

          <UserCounters />

          <div className="-mt-1">
            <NavLink
              to="/social/config"
              className="text-gray-900 font-bold hover:text-yellow-400 "
            >
              <CogIcon className="h-10 w-10 transition-all duration-300 hover:scale-125" />
            </NavLink>
          </div>

          <div>
            <NavLink
              to="/social/logout"
              className="text-gray-900 font-bold hover:text-yellow-400 border-2 border-gray-900 rounded-lg p-2 flex"
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-sm" />
              Salir
            </NavLink>
          </div>
        </article>
      </section>
    </nav>
  );
};

export default Nav;

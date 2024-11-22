import { CogIcon } from "@heroicons/react/24/outline";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import avatar from "../../../assets/img/user.png";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import UserCounters from "../../user/UserCounters";
import NewPublicationForm from "../../publication/NewPublicationForm";

const NewSidebar = () => {
  const { auth } = useAuth();

  return (
    <aside>
      <section className=" flex flex-col h-full">
        <article className="flex flex-col gap-4 items-center">
          <NavLink to="/social/feed" className="p-4">
            <img
              src="/logoRedCorto.webp"
              alt="Logo de la Red Social"
              className="w-16 h-16 rounded-xl border-2 border-red-900 hover:scale-110 hover:border-orange-500 transition-all duration-300"
            />
          </NavLink>

          <NavLink
            to={"/social/profile/" + auth._id}
            className={
              "rounded-lg w-4/5 hover:bg-gray-200 hover:p-4 transition-all duration-300 hover:scale-105"
            }
          >
            <div className="flex justify-start gap-2 ">
              {auth.image !== "default.png" ? (
                <img
                  src={Global.url + "user/avatar/" + auth.image}
                  alt="Foto de Perfil"
                  className="rounded-full w-12 h-12"
                />
              ) : (
                <img
                  src={avatar}
                  alt="Foto de Perfil"
                  className=" rounded-lg w-10 h-10 "
                />
              )}
              <div className=" flex flex-col items-center">
                <h1 className="text-xl font-bold text-gray-900">{auth.name}</h1>
                <p className="text-md text-gray-800">@{auth.nick}</p>
              </div>
            </div>
          </NavLink>

          <NavLink
            to="/social/people"
            className="w-4/5 p-2 flex items-center justify-start gap-2 -mb-2 hover:bg-gray-200 transition-all duration-300 hover:scale-105 hover:p-4 rounded-xl"
          >
            <UserGroupIcon className="h-6 w-6" />
            <div className="font-bold text-xl">Gente</div>
          </NavLink>

          <UserCounters />

          <NewPublicationForm />

          <NavLink
            to="/social/config"
            className="h-auto w-4/5 flex items-center justify-start gap-2 hover:bg-gray-200 hover:p-2 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <CogIcon className="h-6 w-6" />
            <div className="font-bold text-xl">Ajustes</div>
          </NavLink>

          <div>
            <NavLink
              to="/social/logout"
              className="text-gray-900 font-bold border-2 border-red-600 rounded-lg p-2 flex transition-all duration-300 hover:scale-105 hover:p-4"
            >
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-sm" />
              Salir
            </NavLink>
          </div>
        </article>
      </section>
    </aside>
  );
};

export default NewSidebar;

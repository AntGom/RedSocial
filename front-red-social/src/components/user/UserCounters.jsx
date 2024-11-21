import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";

const UserCounters = () => {
  const { auth, counters } = useAuth();

  return (
    <>
      <h1 className="text-xl font-bold -mb-3 w-full ml-16">Mi Red</h1>

      <section className="w-4/5 max-w-4/5 flex flex-col p-2 rounded-lg border-2 border-red-600">

        <article className=" items-center">
          <NavLink to={"siguiendo/" + auth._id}
            className={
              "flex justify-between p-1 hover:bg-gray-200 hover:p-2 transition-all duration-300 hover:scale-105 rounded-lg"}>
            <div className="text-md font-medium text-gray-900 ">Siguiendo</div>
            <div className="text-lg font-semibold text-red-600">
              {counters.following}
            </div>
          </NavLink>
        </article>

        <article className="p-1 items-center">
          <NavLink to={"seguidores/" + auth._id}
            className={
              "flex justify-between hover:bg-gray-200 hover:p-2 transition-all duration-300 hover:scale-105 rounded-lg"}>
            <div className="text-md font-medium text-gray-900 ">Seguidores</div>
            <div className="text-lg font-semibold text-red-600">
              {counters.followers}
            </div>
          </NavLink>
        </article>

        <article className="p-1 items-center">
          <NavLink to={"/social/profile/" + auth._id}
          className={
            "flex justify-between hover:bg-gray-200 hover:p-2 transition-all duration-300 hover:scale-105 rounded-lg"}>
            <div className="text-md font-medium text-gray-900 ">Publicaciones</div>
            <div className="text-lg font-semibold text-red-600 -ml-4">
            {counters.publications}
            </div>
          </NavLink> 
        </article>
      </section>
    </>
  );
};

export default UserCounters;

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { GetProfile } from "../../helpers/GetProfile";
import { NavLink, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/UseAuth";
import PublicationList from "../publication/PublicationList";

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [counters, setCounters] = useState({});
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");

  const getCounters = async () => {
    const request = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();

    if (data.following) {
      setCounters(data);
    }
  };

  const getDataUser = async () => {
    let dataUser = await GetProfile(params.userId, setUser);
    if (dataUser.following && dataUser.following._id) setIFollow(true);
  };

  const getPublications = async (actualPage = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + actualPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await request.json();

    if (data.status === "success") {
      let newPublications = data.publications;

      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications];
      }

      if (newProfile) {
        newPublications = data.publications;
        setMore(true);
      }

      setPublications(newPublications);

      if (!newProfile && newPublications.length >= data.totalArticles) {
        setMore(false);
      }

      if (data.totalPages <= 1) {
        setMore(false);
      }
    }
  };

  const follow = async (userId) => {
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setIFollow(true);
    }
  };

  const unFollow = async (userId) => {
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setIFollow(false);
    }
  };

  useEffect(() => {
    setPage(1);
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [params.userId]);

  if (!user.name) return <div>Cargando...</div>;

  return (
    <>
    <section>
      <header className="w-full h-auto mt-2 mb-4 p-4 bg-white shadow-lg rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:space-x-6">
          <div className="relative flex-shrink-0">
            <img
              src={
                user.image !== "default.png"
                  ? `${Global.url}user/avatar/${user.image}`
                  : avatar
              }
              className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-md transition-all duration-300 hover:scale-105 hover:border-yellow-400"
              alt={`Foto de perfil de ${user.name}`}
            />
          </div>

          <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name} {user.surname}
            </h1>
            <h2 className="text-lg text-gray-700">{user.nick}</h2>
            <p className="text-gray-600 mt-2">{user.bio}</p>

            {user._id !== auth._id && (
              <button
                onClick={() =>
                  iFollow ? unFollow(user._id) : follow(user._id)
                }
                className={`flex min-w-32 items-center justify-center px-2 py-2 font-sm rounded-2xl h-9  shadow-sm transition-all 
                        ${
                          iFollow
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
              >
                {iFollow ? "Dejar de seguir" : "Seguir"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-8
        
         justify-center">
          <NavLink
            to={`/social/siguiendo/${user._id}`}
            className="flex flex-row justify-center items-center bg-cyan-800 p-2 rounded-xl w-auto h-auto hover:bg-gray-200 transition-all gap-1"
          >
            <span className="text-xl font-bold text-yellow-400">
              {counters.following || 0}
            </span>
            <span className="text-sm font-medium text-white">Siguiendo</span>
          </NavLink>
          <NavLink
            to={`/social/seguidores/${user._id}`}
            className="flex flex-row justify-center items-center bg-cyan-800 p-2 rounded-xl w-auto h-auto hover:bg-gray-200 transition-all gap-1"
          >
            <span className="text-xl font-bold text-yellow-400">
              {counters.followers || 0}
            </span>
            <span className="text-sm font-medium text-white">Seguidores</span>
          </NavLink>
          <NavLink
            to={`/social/profile/${user._id}`}
            className="flex flex-row justify-center items-center bg-cyan-800 p-2 rounded-xl w-auto h-auto hover:bg-gray-200 transition-all gap-1"
          >
            <span className="text-xl font-bold text-yellow-400">
              {" "}
              {counters.publications || 0}
            </span>
            <span className="text-sm font-medium text-white">
              Publicaciones
            </span>
          </NavLink>
        </div>
      </header>

      <PublicationList
        publications={publications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        getPublications={getPublications}
      />

      <br />
      </section>
    </>
  );
};

export default Profile;

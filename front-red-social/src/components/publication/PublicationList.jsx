import PropTypes from "prop-types";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import { TrashIcon } from "@heroicons/react/24/solid";
import avatar from "../../assets/img/user.png";
import ReactTimeAgo from "react-time-ago";
import { NavLink } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

const PublicationList = ({ publications, getPublications, page, setPage, more }) => {
  const token = localStorage.getItem("token") || "";
  const { auth } = useAuth();

  const deletePublication = async (publicationId) => {
    const isConfirmed = window.confirm("¿Estás seguro de eliminar esta publicación?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(`${Global.url}publication/remove/${publicationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        getPublications(1, true);
      }
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
    }
  };

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    getPublications(next);
  };

  return (
    <div className="space-y-6">
      {publications.map((publication) => (
        <article
          key={publication._id}
          className="bg-white p-4 rounded-3xl shadow-md border border-gray-200 flex items-center space-x-4"
        >
          <NavLink to={`/social/profile/${publication.user?._id}`}>
            <img
              src={
                publication.user?.image && publication.user.image !== "default.png"
                  ? `${Global.url}user/avatar/${publication.user.image}`
                  : avatar
              }
              alt="Foto de Perfil"
              className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
            />
          </NavLink>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-800">
                <span className="font-bold">
                  {publication.user?.name} {publication.user?.surname}
                </span>
                <span className="text-gray-500 ml-2">
                  <ReactTimeAgo
                    date={new Date(publication.createdAt).getTime()}
                    locale="es-ES"
                  />
                </span>
              </div>
              {auth?._id === publication.user?._id && (
                <button
                  onClick={() => deletePublication(publication._id)}
                  className="text-red-600 hover:text-red-800 flex justify-center items-center"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              )}
            </div>

            <p className="mt-2 text-gray-700">{publication.text}</p>
            {publication.file && (
              <img
                src={`${Global.url}publication/media/${publication.file}`}
                alt="Imagen de la publicación"
                className="mt-3 rounded-lg max-h-60 w-full object-cover border border-gray-200"
              />
            )}

            <CommentsList publicationId={publication._id} />
            <CreateComment publicationId={publication._id} />
          </div>
        </article>
      ))}

      {more && (
        <div className="text-center mt-6">
          <button
            onClick={nextPage}
            className="px-6 py-2 bg-blue-600 text-white rounded-3xl shadow hover:bg-blue-700 focus:outline-none"
          >
            Ver más publicaciones
          </button>
        </div>
      )}
    </div>
  );
};

PublicationList.propTypes = {
  publications: PropTypes.array.isRequired,
  getPublications: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  more: PropTypes.bool.isRequired,
};

export default PublicationList;
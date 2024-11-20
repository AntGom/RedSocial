import PropTypes from "prop-types";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import avatar from "../../assets/img/user.png";
import ReactTimeAgo from "react-time-ago";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import EditPublication from "./EditPublication";
import DeletePublication from "./DeletePublication";
import { Global } from "../../helpers/Global";

const PublicationList = ({ publications, getPublications, page, setPage, more }) => {
  const { auth } = useAuth();

  // Estados
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Cambiar de página y cargar más publicaciones
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
          className="relative bg-white p-4 rounded-3xl shadow-md border border-gray-200 flex items-center space-x-4"
        >
          {/* Imagen de perfil */}
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

          {/* Contenido de la publicación */}
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditing(publication._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setDeleting(publication._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Texto de la publicación */}
            <p className="mt-2 text-gray-700">{publication.text}</p>

            {/* Imagen asociada a la publicación */}
            {publication.file && (
              <img
                src={`${Global.url}publication/media/${publication.file}`}
                alt="Imagen de la publicación"
                className="mt-3 rounded-lg max-h-60 w-full object-cover border border-gray-200"
              />
            )}

            {/* Lista de comentarios y creación de comentarios */}
            <CommentsList publicationId={publication._id} />
            <CreateComment publicationId={publication._id} />
          </div>

          {/* Ventana de edición */}
          {editing === publication._id && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-10">
              <EditPublication
                publication={publication}
                onSave={() => {
                  setEditing(null);
                  getPublications(1, true); // Refrescar publicaciones
                }}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}

          {/* Ventana de eliminación */}
          {deleting === publication._id && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-10">
              <DeletePublication
                publicationId={publication._id}
                onDeleteSuccess={() => {
                  setDeleting(null);
                  getPublications(1, true); // Refrescar publicaciones
                }}
                onCancel={() => setDeleting(null)}
              />
            </div>
          )}
        </article>
      ))}

      {/* Botón para cargar más publicaciones */}
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

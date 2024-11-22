import PropTypes from "prop-types";
import CommentsList from "./CommentsList";
import CreateComment from "./CreateComment";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import avatar from "../../assets/img/user.png";
import ReactTimeAgo from "react-time-ago";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/UseAuth";
import { useState } from "react";
import EditPublication from "./EditPublication";
import DeletePublication from "./DeletePublication";
import { Global } from "../../helpers/Global";

const PublicationList = ({
  publications,
  getPublications,
  page,
  setPage,
  more,
}) => {
  const { auth } = useAuth();

  // Estados
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewingImage, setViewingImage] = useState(null); // Nuevo estado para el modal

  // Cambiar de página y cargar más publicaciones
  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    getPublications(next);
  };

  return (
    <div className="space-y-8">
      {publications.map((publication) => (
        <article
          key={publication._id}
          className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-start space-x-6"
        >
          {/* Imagen de perfil */}
          <NavLink to={`/social/profile/${publication.user?._id}`}>
            <img
              src={
                publication.user?.image &&
                publication.user.image !== "default.png"
                  ? `${Global.url}user/avatar/${publication.user.image}`
                  : avatar
              }
              alt="Foto de Perfil"
              className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover"
            />
          </NavLink>

          {/* Contenido de la publicación */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-800">
                <span className="font-bold">
                  {publication.user?.name} {publication.user?.surname}
                </span>
                <span className="text-gray-600 ml-2">
                  <ReactTimeAgo
                    date={new Date(publication.createdAt).getTime()}
                    locale="es-ES"
                  />
                </span>
              </div>
              {auth?._id === publication.user?._id && (
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setEditing(publication._id)}
                    className="text-blue-600 hover:text-blue-800 hover:scale-125 transition-all duration-300"
                  >
                    <PencilIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setDeleting(publication._id)}
                    className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Texto de la publicación */}
            <p className="mt-4 text-gray-800">{publication.text}</p>

            {/* Imagen asociada a la publicación */}
            {publication.file && (
              <div className="mt-4 relative">
                <img
                  src={`${Global.url}publication/media/${publication.file}`}
                  alt="Imagen de la publicación"
                  className="w-full max-h-96 rounded-lg object-cover cursor-pointer"
                  style={{ aspectRatio: "16/9" }}
                  onClick={() => setViewingImage(publication.file)}
                />
              </div>
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
            <div className="absolute inset-0 bg-white bg-opacity-60 flex flex-col justify-center items-center z-10">
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

      {/* Modal para visualizar la imagen en tamaño grande */}
      {viewingImage && (
        <div className="fixed inset-0 bg-opacity-60 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 text-red-600 font-semibold text-4xl"
            >
              &times;
            </button>
            <img
              src={`${Global.url}publication/media/${viewingImage}`}
              alt="Imagen en tamaño original"
              className="max-w-screen max-h-screen rounded-lg mb-8"
            />
          </div>
        </div>
      )}

      {/* Botón para cargar más publicaciones */}
      {more && (
        <div className="text-center mt-8">
          <button
            onClick={nextPage}
            className="text-gray-900 font-bold border-2 border-red-600 p-2 rounded-lg hover:scale-105 transition-all mb-6"
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

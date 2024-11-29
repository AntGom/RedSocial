import PropTypes from "prop-types";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import ReactTimeAgo from "react-time-ago";
import avatar from "../../assets/img/user.png";
import useAuth from "../../hooks/UseAuth";
import EditPublication from "./EditPublication";
import DeletePublication from "./DeletePublication";
import CommentsList from "./Comments/CommentsList";
import CreateComment from "./Comments/CreateComment";
import LikeButton from "./Likes/LikeButton";
import { Global } from "../../helpers/Global";

const PublicationCard = ({ publication, getPublications }) => {
  const { auth } = useAuth();

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);

  return (
    <article className="relative bg-white rounded-lg border hover:bg-gray-100 p-6 flex items-start space-x-6">
      {/* Imagen de perfil */}
      <NavLink to={`/social/profile/${publication.user?._id}`}>
        <img
          src={
            publication.user?.image && publication.user.image !== "default.png"
              ? `${Global.url}user/avatar/${publication.user.image}`
              : avatar
          }
          alt="Foto de Perfil"
          className="w-16 h-16 rounded-full object-cover transition-all duration-300 hover:scale-110"
        />
      </NavLink>

      {/* Contenido */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-row text-sm text-gray-800">
            <p className="font-bold">
              {publication.user?.name} {publication.user?.surname}
            </p>
            <p className="text-gray-600 ml-2">
              <ReactTimeAgo
                date={new Date(publication.createdAt).getTime()}
                locale="es-ES"
              />
            </p>
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
        {/* Texto */}
        <p className="mt-4 text-gray-800">{publication.text}</p>
        {/* Imagen asociada */}
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

        {/* Botón de Like */}
        <div className="mt-4">
          <LikeButton 
            initialLikes={publication.likes?.length || 0}
            initialLiked={publication.likes?.includes(auth?._id)}
            publicationId={publication._id}
            onLikeChange={(newCount) => {
              // Actualizar el estado local de la publicación si es necesario
              publication.likes.length = newCount;
            }}
          />
        </div>

        {/* Lista de comentarios */}
        <CommentsList
          publicationId={publication._id}
          publicationUserId={publication.user?._id}
        />
        <CreateComment publicationId={publication._id} />
      </div>

      {/* Edición */}
      {editing === publication._id && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-10">
          <EditPublication
            publication={publication}
            onSave={() => {
              setEditing(null);
              getPublications(1, true);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* Eliminación */}
      {deleting === publication._id && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex flex-col justify-center items-center z-10">
          <DeletePublication
            publicationId={publication._id}
            onDeleteSuccess={() => {
              setDeleting(null);
              getPublications(1, true);
            }}
            onCancel={() => setDeleting(null)}
          />
        </div>
      )}

      {/* Modal para imagen */}
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
              className="max-w-screen h-screen rounded-lg"
            />
          </div>
        </div>
      )}
    </article>
  );
};

PublicationCard.propTypes = {
  publication: PropTypes.object.isRequired,
  getPublications: PropTypes.func.isRequired,
};

export default PublicationCard;
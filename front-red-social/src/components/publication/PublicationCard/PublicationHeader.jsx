import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import ReactTimeAgo from "react-time-ago";
import avatar from "../../../assets/img/user.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/UseAuth";

const getUserImage = (image) => {
  return image && image !== "default.png" ? `${Global.url}user/avatar/${image}` : avatar;
};

const PublicationHeader = ({ publication, onEdit, onDelete }) => {
  const { auth } = useAuth();
  console.log("Datos de auth en PublicationHeader:", auth);
  console.log('Rol del usuario:', auth?.role);


  
  //Usuario es ower/admin?
  const isUserOwnerOrAdmin = auth?._id === publication.user?._id || auth?.role === "admin";

  return (
    <div className="flex items-center justify-between">
      <div className="flex text-sm text-gray-800">
        <NavLink to={`/social/profile/${publication.user?._id}`}>
          <img
            src={getUserImage(publication.user?.image)}
            alt="Foto de Perfil"
            className="w-16 h-16 rounded-full object-cover transition-all border border-red-600 duration-300 hover:scale-110"
          />
        </NavLink>
        <div className="ml-4">
          <p className="font-bold">{`${publication.user?.name} ${publication.user?.surname}`}</p>
          <p className="text-gray-600">
            <ReactTimeAgo
              date={new Date(publication.createdAt).getTime()}
              locale="es-ES"
            />
          </p>
        </div>
      </div>
      {isUserOwnerOrAdmin && (
        <div className="flex items-center space-x-4">
          {/* Botón para editar la publicación */}
          <button
            onClick={() => onEdit(publication._id)}
            className="text-blue-600 hover:text-blue-800 hover:scale-125 transition-all duration-300"
          >
            <PencilIcon className="h-6 w-6" />
          </button>
          {/* Botón para eliminar la publicación */}
          <button
            onClick={() => onDelete(publication._id)}
            className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

PublicationHeader.propTypes = {
  publication: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PublicationHeader;

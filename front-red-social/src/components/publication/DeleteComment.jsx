import { TrashIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Global } from "../../helpers/Global";

const DeleteComment = ({ publicationId, commentId, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      return;
    }

    try {
      const response = await fetch(
        `${Global.url}publication/${publicationId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        onDelete(commentId);
      } else {
        alert("No se pudo eliminar el comentario.");
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
      title="Eliminar comentario"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
};

DeleteComment.propTypes = {
  publicationId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DeleteComment;
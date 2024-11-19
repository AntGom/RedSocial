import { useState } from "react";
import { Global } from "../../helpers/Global";
import PropTypes from "prop-types";

const CreateComment = ({ publicationId }) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    setError("");

    try {
      const response = await fetch(`${Global.url}publication/comment/${publicationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setCommentText("");
        // Recargar los comentarios desde el padre
        window.location.reload();
      } else {
        setError(data.message || "Hubo un error al agregar el comentario.");
      }
    } catch (error) {
      console.error("Error al crear comentario:", error);
      setError("Error al crear el comentario.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-3">
      <textarea
        value={commentText}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-2xl"
        placeholder="Escribe un comentario..."
        rows="2"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Comentar
      </button>
    </form>
  );
};

CreateComment.propTypes = {
  publicationId: PropTypes.string.isRequired
};

export default CreateComment;
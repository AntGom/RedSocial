/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../../helpers/Global";
import PropTypes from "prop-types";
import DeleteComment from "../Comments/DeleteComment";
import ReactTimeAgo from "react-time-ago";

const CommentsList = ({ publicationId, publicationUserId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${Global.url}publication/comments/${publicationId}`,
        {
          method: "GET",
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setComments(data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [publicationId]);

  const handleCommentDelete = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId)
    );
  };

  const toggleComments = () => setShowComments((prev) => !prev);

  if (loading) return <p>Cargando comentarios...</p>;

  return (
    <div className="mt-1">
      <button
        onClick={toggleComments}
        className="text-blue-600 font-semibold underline hover:text-blue-800"
      >
        {showComments
          ? `Ocultar comentarios (${comments.length})`
          : `Mostrar comentarios (${comments.length})`}
      </button>

      {showComments &&
        (comments.length === 0 ? (
          <p className="text-gray-500 mt-0">No hay comentarios aún.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start space-x-3 mt-3 bg-gray-100 p-3 rounded-lg"
            >
              <img
                src={
                  comment.user?.image && comment.user.image !== "default.png"
                    ? `${Global.url}user/avatar/${comment.user.image}`
                    : `${Global.url}user/avatar/default.png`
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover"
              />
              <div className="flex-1">
                <div className="flex flex-row items-center">
                  <p className="font-semibold text-gray-800">
                    {comment.user?.name} {comment.user?.surname}
                  </p>
                  <p className="text-gray-600 text-sm items-center ml-2">
                    <ReactTimeAgo
                      date={new Date(comment.createdAt).getTime()}
                      locale="es-ES"
                    />
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              </div>
              <DeleteComment
                publicationId={publicationId}
                publicationUserId={publicationUserId}
                onDelete={handleCommentDelete}
                commentId={comment._id}
                commentUserId={comment.user._id}
              />
            </div>
          ))
        ))}
    </div>
  );
};

CommentsList.propTypes = {
  publicationId: PropTypes.string.isRequired,
  publicationUserId: PropTypes.string.isRequired,
};

export default CommentsList;

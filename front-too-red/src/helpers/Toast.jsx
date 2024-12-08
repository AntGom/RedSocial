import PropTypes from "prop-types";
import clsx from "clsx";

const Toast = ({ message, type, onClose }) => {
  return (
    <section className="bg-gray-600 w-2/6 h-2/6 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-4 px-6 rounded-lg shadow-lg z-50 text-center">
    <article
      className={clsx(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-4 px-6 rounded-lg shadow-lg z-50 text-center",
        {
          "bg-green-600 text-white": type === "success",
          "bg-red-600 text-white": type === "error",
        }
      )}
    >
      <p className="font-semibold mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-white text-gray-800 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition-all duration-300"
      >
        Aceptar
      </button>
    </article>
    </section>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;

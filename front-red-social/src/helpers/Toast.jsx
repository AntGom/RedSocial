import { useEffect } from "react";
import PropTypes from "prop-types";

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <div
        className={`fixed bottom-16 left-1/2 font-semibold transform -translate-x-1/2 bg-${type}-600 text-gray-900 border-2 border-red-600 py-2 px-4 rounded-lg shadow-lg transition-all duration-300`}
      >
        <p>{message}</p>
      </div>
    );
  };
  

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;

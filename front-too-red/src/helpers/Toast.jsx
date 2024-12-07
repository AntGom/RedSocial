import { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from 'clsx';


const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
<div className={clsx(
  "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-4 px-6 rounded-lg shadow-lg z-50 text-center",
  {
    "bg-success-600": type === "success",
    "bg-error-600": type === "error"
  }
)}>
  <p className="font-semibold">{message}</p>
</div>
  );
};

  

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toast;

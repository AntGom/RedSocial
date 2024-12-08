import PropTypes from "prop-types";
import Toast from "../../../../helpers/Toast";

const ToastManager = ({ showToast, toast, onClose }) => {
  return (
    <>
      {showToast && <Toast message={toast.message} type={toast.type} onClose={onClose} />}
    </>
  );
};

ToastManager.propTypes = {
  showToast: PropTypes.bool.isRequired,
  toast: PropTypes.shape({
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ToastManager;

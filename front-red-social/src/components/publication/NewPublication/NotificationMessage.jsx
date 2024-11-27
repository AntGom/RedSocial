import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/24/outline";

const NotificationMessage = ({ status, setStatus, successMessage, errorMessage }) => (
  status !== "not_stored" && (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
      <div
        className={`relative p-4 rounded-lg shadow-md text-center text-white ${
          status === "stored" ? "bg-green-600" : "bg-red-600"
        }`}
        aria-live="polite"
      >
        <div className="flex justify-between items-center">
          <p className="p-2">
            {status === "stored" ? successMessage : errorMessage}
          </p>
          <button
            onClick={() => setStatus("not_stored")}
            className="text-white font-bold text-xl"
            aria-label="Cerrar mensaje"
          >
            <XCircleIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
);

NotificationMessage.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
  successMessage: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default NotificationMessage;

import { XCircleIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types"; // Importa PropTypes

const LoginMessage = ({ saved, setSaved }) => {
  return (
    saved === "login" || saved === "error" ? (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
        <div
          className={`relative p-4 rounded-lg shadow-md text-center text-white ${
            saved === "login" ? "bg-green-600" : "bg-red-600"
          }`}
          aria-live="polite"
        >
          <div className="flex">
            <p className="p-2">
              {saved === "login"
                ? "¡¡Usuario identificado correctamente!!"
                : "Email o contraseña incorrectos"}
            </p>
            <button
              onClick={() => setSaved("not_sended")}
              className="text-white font-bold text-xl"
              aria-label="Cerrar mensaje"
            >
              <XCircleIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    ) : null
  );
};

// Validación de las props en LoginMessage
LoginMessage.propTypes = {
  saved: PropTypes.string.isRequired,
  setSaved: PropTypes.func.isRequired,
};

export default LoginMessage;
